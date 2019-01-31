"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.tokenuri = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
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

    const tokenUri = {
      name: "result.Item.repo " + result.Item.repo,
      description: "some description",
      image: "https://odyssy.io/somepath/someimage.png",
      meta: result.Item.metaData
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(tokenUri)
    };
    callback(null, response);
  });
};
