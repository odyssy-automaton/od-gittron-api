"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.disableBots = async (event, context) => {
  const timestamp = new Date().getTime();
  const oneHourAgo = new Date().getTime() - 3600000;

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression:
        "#disabled = :disabled and #mined = :mined and #createdAt > :endTime ",
      ExpressionAttributeNames: {
        "#disabled": "disabled",
        "#mined": "mined",
        "#createdAt": "createdAt"
      },
      ExpressionAttributeValues: {
        ":disabled": false,
        ":mined": false,
        ":endTime": oneHourAgo
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

    const res = await getAbandonedBots;
    console.log("res.Count");
    console.log(res.Count);
    console.log(res.Items);

    const proms = [];
    res.Items.forEach(bot => {
      if (bot.txHash === null) {
        let updateParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            tokenId: bot.tokenId,
            ghid: bot.ghid
          },
          ExpressionAttributeValues: {
            ":disabled": true,
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
              // console.log("Success", data);
              res(data);
            }
          });
        });

        proms.push(updateBot);
      }
    });

    console.log("proms.length");
    console.log(proms.length);

    // const res = await Promise.all(proms);

    // return res;
    return;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};
