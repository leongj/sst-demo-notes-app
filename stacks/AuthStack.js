import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);

  // Create Cognito User Pool and Identity Pool
  // Auth simplifies a lot of plumbing in CDK
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    auth,
  };
}