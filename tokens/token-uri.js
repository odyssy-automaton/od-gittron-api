"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.tokenUri = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "tokenId = :hkey",
    ExpressionAttributeValues: {
      ":hkey": event.pathParameters.tokenId
    }
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the repo."
      });
      return;
    }

    if (result.Count) {
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result.Items[0].tokenUriData)
      };
      callback(null, response);
    } else {
      const response = {
        statusCode: 200,
        body: "no robot at this uri"
      };
      callback(null, response);
    }
  });
};
