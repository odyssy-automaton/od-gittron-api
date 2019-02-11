"use strict";

const AWS = require("aws-sdk");
const EtherScanApi = require("../util/etherscan-api");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.exports.update = (event, context, callback) => {
module.exports.update = async (event, context) => {
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

  try {
    const api = new EtherScanApi();
    const txStatus = await api.getTransactionReceipt(data.txHash);

    if (txStatus.result.status === "0x1") {
      const updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          ghid: event.pathParameters.ghid,
          tokenId: event.pathParameters.tokenid
        },
        ExpressionAttributeValues: {
          ":mined": data.mined,
          ":updatedAt": timestamp
        },
        UpdateExpression: "SET mined = :mined, updatedAt = :updatedAt",
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
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ status: "Success" })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ status: "Failed" })
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: error
    };
  }
};
