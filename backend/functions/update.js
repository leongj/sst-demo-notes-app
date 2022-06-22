import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  // dynamoDb interaction params
  const params = {
    TableName: process.env.TABLE_NAME,
    // partition key and sort key of the item to update
    Key: {
      userId: "123", // hardcoded for now
      noteId: event.pathParameters.id, // The id of the note from the path
    },
    // attributes to be updated, and how to set value
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
    // how to return item attributes from dynamoDb call
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return { status: true };
});