const AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const tableName = "gittron-bot-api-dev";
const tableName = "gittron-bot-api-prod";
const params = {
  TableName: tableName
};

const timestamp = new Date().getTime();

const backfillRelatedPrime = async () => {
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

  const primeDNAMap = mapPrimeDNA(allBots.Items);

  const cloneBots = allBots.Items.filter(bot => {
    return bot.tokenType !== "prime" && !bot.relatedPrimeBot;
  });

  const proms = [];
  cloneBots.forEach(bot => {
    let botDna = parseDNA(bot.dna);
    let relatedPrimeBot = primeDNAMap[botDna];

    let updateParams = {
      TableName: tableName,
      Key: {
        tokenId: bot.tokenId,
        ghid: bot.ghid
      },
      ExpressionAttributeValues: {
        ":relatedPrimeBot": relatedPrimeBot,
        ":updatedAt": timestamp
      },
      UpdateExpression:
        "SET relatedPrimeBot = :relatedPrimeBot, updatedAt = :updatedAt",
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
  });

  try {
    await Promise.all(proms);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

const mapPrimeDNA = bots => {
  const primeBots = bots.filter(bot => bot.tokenType === "prime");

  return primeBots.reduce((map, bot) => {
    const dna = parseDNA(bot.dna);
    map[dna] = bot.tokenId;
    return map;
  }, {});
};

const parseDNA = dnaString => {
  let ary = dnaString.split("-");
  ary.pop();
  ary.pop();
  ary.pop();
  return ary.join("");
};

backfillRelatedPrime();
