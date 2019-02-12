"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // TODO: better validation
  if (typeof data.txHash !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the repo."
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      tokenId: event.pathParameters.tokenId,
      ghid: event.pathParameters.ghid
    },
    ExpressionAttributeValues: {
      ":txHash": data.txHash,
      ":updatedAt": timestamp
    },
    UpdateExpression: "SET txHash = :txHash, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the repo."
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result.Attributes)
    };
    callback(null, response);
  });
};
