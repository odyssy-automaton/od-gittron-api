"use strict";

const AWS = require("aws-sdk");
const ethers = require("ethers");
const abi = require("../util/abi");
const contractAddress = process.env.CONTRACT_ADDRESS;
var _ = require("lodash");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.enableBots = async (event, context) => {
  const provider = ethers.getDefaultProvider(process.env.ETHEREUM_NETWORK);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const timestamp = new Date().getTime();

  try {
    const filter = await contract.filters.Transfer();
    filter.fromBlock = 0;
    filter.toBlock = "latest";

    const logs = await provider.getLogs(filter);

    const transactionTokens = logs.map(
      log => contract.interface.parseLog(log).values.tokenId._hex
    );
    const contractTokens = [...new Set(transactionTokens)];

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: "#disabled = :disabled",
      ExpressionAttributeNames: {
        "#disabled": "disabled"
      },
      ExpressionAttributeValues: {
        ":disabled": true
      }
    };

    const getAllBots = new Promise((res, rej) => {
      dynamoDb.scan(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          res(data);
        }
      });
    });

    const botRes = await getAllBots;
    const dbBots = botRes.Items.map(bot => bot.tokenId);
    const intersection = _.intersection(contractTokens, dbBots);

    console.log("disabled bot on contract");
    console.log(intersection);

    const proms = [];

    for (const tokenId of intersection) {
      let bot = botRes.Items.find(bot => bot.tokenId === tokenId);

      console.log("bad bot");
      console.log(bot);

      let updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          tokenId: bot.tokenId,
          ghid: bot.ghid
        },
        ExpressionAttributeValues: {
          ":disabled": false,
          ":updatedAt": timestamp
        },
        UpdateExpression: "SET disabled = :disabled, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };

      let updateBot = new Promise((res, rej) => {
        dynamoDb.update(updateParams, function(err, data) {
          if (err) {
            console.log("Error", err);
            rej(err);
          } else {
            console.log("Success", data);
            res(data);
          }
        });
      });

      proms.push(updateBot);
    }

    const res = await Promise.all(proms);

    return res;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};
