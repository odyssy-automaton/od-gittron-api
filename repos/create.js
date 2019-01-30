"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");
const Githubber = require("../util/githubber");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // TODO: better validation
  if (typeof data.repo !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the repo item."
    });
    return;
  }

  const githubber = new Githubber({
    repo: data.repo,
    owner: data.repoOwner
  });

  githubber.getRepo().then(res => {
    console.log(res);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: res.id.toString(),
        repo: data.repo,
        repoOwner: data.repoOwner,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    dynamoDb.put(params, error => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't create the repo."
        });
        return;
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item)
      };
      callback(null, response);
    });
  });
};
