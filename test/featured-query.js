const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

const disableBots = async () => {
  try {
    const params = {
      TableName: tableName,
      FilterExpression: "#featured = :featured",
      ExpressionAttributeNames: {
        "#featured": "featured"
      },
      ExpressionAttributeValues: {
        ":featured": true
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
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

disableBots();
