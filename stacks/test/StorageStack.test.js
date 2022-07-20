import { Template } from "aws-cdk-lib/assertions";
import { App, getStack } from "@serverless-stack/resources";
import { StorageStack } from "../StorageStack";
import { test } from "vitest";

test("Test StorageStack", () => {
  const app = new App();
  // WHEN
  app.stack(StorageStack);
  // THEN
  const template = Template.fromStack(getStack(StorageStack));
  
  // Check BillingMode - this the default setting in SST's Table construct
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",   
  });
});