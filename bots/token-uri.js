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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: "Couldn't fetch the repo."
      });
      return;
    }

    if (result.Count) {
      let uriData = result.Items[0].tokenUriData;

      if (!result.Items[0].mined) {
        uriData.image =
          "https://s3.amazonaws.com/odyssy-assets/Gittron__BotCube.png";
      }

      uriData.attributes.forEach(attribute => {
        if (
          attribute.display_type === "number" &&
          typeof attribute.value === "string"
        ) {
          attribute.value = parseFloat(attribute.value);
        }
      });

      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(uriData)
      };
      callback(null, response);
    } else {
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: "no robot at this uri"
      };
      callback(null, response);
    }
  });
};
