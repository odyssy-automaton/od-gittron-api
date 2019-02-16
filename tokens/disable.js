"use strict";

const AWS = require("aws-sdk");
const { disableToken } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.disable = async (event, context) => {
  try {
    await disableToken(event.pathParameters.tokenId, event.pathParameters.ghid);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify({ message: "disabled" })
    };
  } catch (err) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: error
    };
  }
};
