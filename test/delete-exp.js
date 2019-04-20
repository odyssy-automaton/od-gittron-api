const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";
const tokenId = "0x067c6f37d18e3736b963608efda73d89";

const params = {
  TableName: tableName,
  KeyConditionExpression: "tokenId = :hkey",
  ExpressionAttributeValues: {
    ":hkey": tokenId
  }
};

const deleteParam = async () => {
  const getBot = new Promise((res, rej) => {
    dynamoDb.query(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        rej(err);
      } else {
        console.log("Success", data);
        res(data);
      }
    });
  });

  const botRes = await getBot;
  const bot = botRes.Items[0];

  // console.log(bot);

  let updateParams = {
    TableName: tableName,
    Key: {
      tokenId: bot.tokenId,
      ghid: bot.ghid
    },
    UpdateExpression: "REMOVE relatedChildBot",
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

  try {
    await updateBot;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

deleteParam();
