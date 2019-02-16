"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getByRepo = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: "byRepo",
    KeyConditionExpression: "ghid = :hkey",
    ExpressionAttributeValues: {
      ":hkey": event.pathParameters.ghid
    }
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: "Couldn't fetch the repo."
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify(result.Items)
    };
    callback(null, response);
  });
};
