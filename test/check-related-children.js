const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

const checkRelatedChildren = async () => {
  try {
    const params = {
      TableName: tableName,
      FilterExpression:
        "#generation IN (:generation1, :generation2, :generation3, :generation4) and #tokenType = :tokenType",
      // "#generation = :generation1 and #tokenType = :tokenType",
      ExpressionAttributeNames: {
        "#generation": "generation",
        "#tokenType": "tokenType"
      },
      ExpressionAttributeValues: {
        ":generation1": "1",
        ":generation2": "2",
        ":generation3": "3",
        ":generation4": "4",
        ":tokenType": "prime"
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
    // console.log(res.Items);

    const genBots = res.Items.map(bot => bot.tokenId);
    const ancestors = res.Items.map(bot => bot.relatedAncestorBot);

    console.log("gen 1+");
    console.log(genBots);
    console.log("ancestors");
    console.log(ancestors);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

checkRelatedChildren();
