const AWS = require("aws-sdk");

const { getByTokenId } = require("../util/dyanamo-queries");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

var tokenIds = [
  "0x0162dfdd391204353c3f4577e5dfa705",
  "0x3502c19ee6d9656301b005dfa028bbf3"
];

const getAllBots = async tokenIds => {
  const proms = tokenIds.map(tokenId => {
    const params = {
      TableName: tableName,
      KeyConditionExpression: "tokenId = :hkey",
      ExpressionAttributeValues: {
        ":hkey": tokenId
      }
    };

    return new Promise((res, rej) => {
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
  });

  try {
    const resp = await Promise.all(proms);
    const allBots = resp.map(res => res.Items[0]);

    console.log(allBots);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

getAllBots(tokenIds);
