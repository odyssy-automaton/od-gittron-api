"use strict";

const AWS = require("aws-sdk");
const ethers = require("ethers");
const abi = require("../util/abi");
const contractAddress = process.env.CONTRACT_ADDRESS;
const EtherScanApi = require("../util/etherscan-api");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const api = new EtherScanApi();

module.exports.disableBots = async (event, context) => {
  const provider = ethers.getDefaultProvider(process.env.ETHEREUM_NETWORK);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const timestamp = new Date().getTime();
  const twoHoursAgo = new Date().getTime() - 7200000;

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression:
        "#disabled = :disabled and #mined = :mined and #hatched = :hatched and #createdAt < :endTime ",
      ExpressionAttributeNames: {
        "#disabled": "disabled",
        "#mined": "mined",
        "#hatched": "hatched",
        "#createdAt": "createdAt"
      },
      ExpressionAttributeValues: {
        ":disabled": false,
        ":mined": false,
        ":hatched": false,
        ":endTime": twoHoursAgo
      }
    };

    const getAbandonedBots = new Promise((res, rej) => {
      dynamoDb.scan(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          // console.log("Success", data);
          res(data);
        }
      });
    });

    const abandonedRes = await getAbandonedBots;
    console.log("Abandoned Bots Count");
    console.log(abandonedRes.Count);

    const proms = [];
    for (const bot of abandonedRes.Items) {
      let onContract = true;
      try {
        const ownerOf = await contract.ownerOf(bot.tokenId);
        console.log("ownerOf");
        console.log(ownerOf);
      } catch (err) {
        console.log("token not on contract");
        console.log(err);
        onContract = false;
      }

      let updateParams;
      if (onContract) {
        updateParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            tokenId: bot.tokenId,
            ghid: bot.ghid
          },
          ExpressionAttributeValues: {
            ":mined": true,
            ":updatedAt": timestamp
          },
          UpdateExpression: "SET mined = :mined, updatedAt = :updatedAt",
          ReturnValues: "ALL_NEW"
        };
      } else {
        const txStatus = bot.txHash
          ? await api.txStatus(bot.txHash)
          : "not found";

        if (txStatus === "failed" || txStatus === "not found") {
          updateParams = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
              tokenId: bot.tokenId,
              ghid: bot.ghid
            },
            ExpressionAttributeValues: {
              ":disabled": true,
              ":updatedAt": timestamp
            },
            UpdateExpression:
              "SET disabled = :disabled, updatedAt = :updatedAt",
            ReturnValues: "ALL_NEW"
          };
        }
      }

      if (updateParams) {
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
    }

    const res = await Promise.all(proms);

    return res;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};
