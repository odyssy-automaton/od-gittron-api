"use strict";

const AWS = require("aws-sdk");
const Githubber = require("../util/githubber");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.registered = (event, context, callback) => {
  const githubber = new Githubber({
    repo: event.pathParameters.repo,
    owner: event.pathParameters.repoOwner
  });

  githubber
    .getRepo()
    .catch(err => {
      callback(null, {
        statusCode: err.status || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Repo doesn't exist"
      });
      return;
    })
    .then(res => {
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: res.id.toString()
        }
      };

      dynamoDb.get(params, (error, result) => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { "Content-Type": "text/plain" },
            body: "Not registered"
          });
          return;
        }

        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Item)
        };
        callback(null, response);
      });
    });
};
