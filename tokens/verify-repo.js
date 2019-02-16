"use strict";
require("dotenv").config();

const AWS = require("aws-sdk");
const GitHubData = require("../util/github-data");
const { getByTokenId } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.verifyRepo = async (event, context) => {
  const timestamp = new Date().getTime();

  try {
    const getRes = await getByTokenId(event.pathParameters.tokenId);
    const masterToken = getRes.Items[0];

    const githubber = new GitHubData({
      repo: masterToken.repo,
      owner: masterToken.repoOwner
    });
    const verificationAddress = await githubber.getVerificationAddress();

    if (
      parseInt(masterToken.orignalOwnerAddress) ===
      parseInt(verificationAddress)
    ) {
      const updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          tokenId: masterToken.tokenId,
          ghid: masterToken.ghid
        },
        ExpressionAttributeValues: {
          ":verified": true,
          ":updatedAt": timestamp
        },
        UpdateExpression: "SET verified = :verified, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };

      const updateItem = new Promise((res, rej) => {
        dynamoDb.update(updateParams, function(err, data) {
          if (err) {
            console.log("Error", err);
            rej(err);
          } else {
            console.log("Success", data);
            res("Hi, data update completed");
          }
        });
      });

      await updateItem;

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({ status: "verified" })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({ status: "unverified" })
      };
    }
  } catch (error) {
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
