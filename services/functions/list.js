import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    // defines the condition for the query, uses the partitionkey
    KeyConditionExpression: "userId = :userId",
    // defines the value used in the condition
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId, // userId from Cognito
    },
  };

  const result = await dynamoDb.query(params);
  // Tutorial doesn't put in any exception handling?

  // Return the matching list of items in response body
  return result.Items;
});