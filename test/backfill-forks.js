require("dotenv").config();
const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const GitHubData = require("../util/github-data");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const tableName = "gittron-bot-api-dev";
const tableName = "gittron-bot-api-prod";
const params = {
  TableName: tableName
};

const timestamp = new Date().getTime();

const backfillForks = async () => {
  const getAll = new Promise((res, rej) => {
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

  const allBots = await getAll;

  const proms = [];
  asyncForEach(allBots.Items, async bot => {
    console.log(bot.forked);
    console.log(bot.forked === undefined);
    if (!bot.disabled) {
      let options = {
        repo: bot.repo,
        owner: bot.repoOwner
      };

      try {
        let githubber = new GitHubData(options);
        let { data } = await githubber.getRepo();

        console.log(bot.tokenId);
        console.log(data.fork);

        let updateParams = {
          TableName: tableName,
          Key: {
            tokenId: bot.tokenId,
            ghid: bot.ghid
          },
          ExpressionAttributeValues: {
            ":forked": data.fork,
            ":updatedAt": timestamp
          },
          UpdateExpression: "SET forked = :forked, updatedAt = :updatedAt",
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

        console.log(proms.length);
      } catch (err) {
        return;
      }
    }
  });

  try {
    await Promise.all(proms);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

backfillForks();
