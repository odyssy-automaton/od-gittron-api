"use strict";

const AWS = require("aws-sdk");
const Githubber = require("../util/githubber");
const MetaMaker = require("../util/metaMaker");

var lambda = new AWS.Lambda({
  region: "us-east-1"
});

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
      // TODO: error handling
      // TODO: save the token metadata in subtable
      const metaMaker = new MetaMaker(res);

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          id: res.id.toString(),
          repo: data.repo,
          repoOwner: data.repoOwner,
          metaData: metaMaker.generateMetaData(),
          createdAt: timestamp,
          updatedAt: timestamp
        }
      };

      lambda.invoke(
        {
          FunctionName: "fetch-file-and-store-in-s3-dev-phantomflatr",
          Payload: JSON.stringify({ id: res.id, msg: "poopin" }, null, 2) // pass params
        },
        function(error, data) {
          if (error) {
            console.log(error);
            // context.done("error", error);
          }
          if (data.Payload) {
            console.log(data.Payload);
            // context.succeed(data.Payload);
          }
        }
      );

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
