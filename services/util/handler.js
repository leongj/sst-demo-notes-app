// Handler function is a wrapper for the lambdas
// The required lambda is passed in, then executed in the try/catch

export default function handler(lambda) {
  return async function (event, context) {
    let body, statusCode;

    try {
      // Run the lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      console.error(e);
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
}