"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.generateCreature = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      ghid: event.pathParameters.ghid,
      uuid: event.pathParameters.uuid
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the repo."
      });
      return;
    }

    console.log(result.Item);

    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify(result.Item)
    // };
    // callback(null, response);
  });
};
