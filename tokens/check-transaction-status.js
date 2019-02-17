"use strict";

const AWS = require("aws-sdk");
const EtherScanApi = require("../util/etherscan-api");
const { disableToken, updateToken } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const lambda = new AWS.Lambda({
  region: "us-east-1"
});

module.exports.checkTransactionStatus = async (event, context) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (!data.txHash || !data.tokenId || !data.ghid) {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: "Couldn't update the repo."
    };
  }

  try {
    if (data.txHash === "rejected") {
      await disableToken(data.tokenId, data.ghid);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({
          message: "Disabled bot after error or rejection"
        })
      };
    } else {
      const updateTxParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          tokenId: data.tokenId,
          ghid: data.ghid
        },
        ExpressionAttributeValues: {
          ":txHash": data.txHash,
          ":updatedAt": timestamp
        },
        UpdateExpression: "SET txHash = :txHash, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };

      await updateToken(updateTxParams);
    }

    const api = new EtherScanApi();
    const txStatus = await api.getTransactionReceipt(data.txHash);

    const status = txStatus.result ? txStatus.result.status : "pending";

    if (status === "0x1") {
      const updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          tokenId: data.tokenId,
          ghid: data.ghid
        },
        ExpressionAttributeValues: {
          ":mined": true,
          ":txHash": data.txHash,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET mined = :mined, txHash = :txHash, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };

      await updateToken(updateParams);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({ message: "Transaction Mined" })
      };
    } else if (status === "0x0") {
      await disableToken(data.tokenId, data.ghid);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({ status: "disabled" })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.ORIGIN
        },
        body: JSON.stringify({ status: "Pending" })
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
