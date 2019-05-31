const AWS = require("aws-sdk");
const ethers = require("ethers");
const abi = require("../util/abi");
var _ = require("lodash");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

//rinkeby
const contractAddress = "0xfb6ff3d0eba6b8e69fceb04afe5f230611a34a36";
//main
// const contractAddress = "0x162d3e80d51f96240ae0a44ab3a5b1ea23920ce4";

const provider = ethers.getDefaultProvider("rinkeby");
// const provider = ethers.getDefaultProvider("homestead");
const contract = new ethers.Contract(contractAddress, abi, provider);

const tester = async () => {
  try {
    const filter = await contract.filters.Transfer();
    console.log("filter");
    console.log(filter);

    // filter.fromBlock = provider.getBlockNumber().then(b => b - 10000);
    filter.fromBlock = 0;
    filter.toBlock = "latest";

    let contractTokens = [];

    const logs = await provider.getLogs(filter);

    const transactionTokens = logs.map(
      log => contract.interface.parseLog(log).values.tokenId._hex
    );

    const tokenIds = [...new Set(transactionTokens)];

    console.log("contract tokenIds");
    console.log(tokenIds.length);
    // console.log(tokenIds);

    contractTokens = tokenIds;

    const params = {
      TableName: tableName,
      // AttributesToGet: ["tokenId", "ghid"],
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
          // console.log("Success", data);
          res(data);
        }
      });
    });

    const res = await getAllBots;

    console.log("database disabled tokens");
    console.log(res.Items.length);

    const dbBots = res.Items.map(bot => bot.tokenId);

    console.log("contractTokens.length");
    console.log(contractTokens.length);

    const intersection = _.intersection(contractTokens, dbBots);

    console.log(intersection);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

tester();
