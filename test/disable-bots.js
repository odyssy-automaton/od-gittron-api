const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

const disableBots = async () => {
  const timestamp = new Date().getTime();
  const oneHourAgo = new Date().getTime() - 3600000;

  try {
    const params = {
      TableName: tableName,
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

    const getAllBots = new Promise((res, rej) => {
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

    const res = await getAllBots;
    console.log("res.Count");
    console.log(res.Count);
    console.log(res.Items);

    const proms = [];
    res.Items.forEach(bot => {
      // const olderThanOneHour = bot.createdAt < new Date().getTime() - 3600000;

      if (bot.txHash === null) {
        let updateParams = {
          TableName: tableName,
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

    // await Promise.all(proms);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

disableBots();
