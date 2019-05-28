const AWS = require("aws-sdk");

const { getByTokenId } = require("../util/dyanamo-queries");

var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "gittron-bot-api-dev";
// const tableName = "gittron-bot-api-prod";

//dev
var tokenIds = [
  "0xd15bd659ff744a6e51cd36b6d425b481",
  "0x0cac38b2fa77261ecb58b65e88c5ca0c",
  "0xf8a456a2f3d0e028307a895acf300ae6",
  "0x7bd19b0900af2106fed44cb8d9de11f3",
  "0x111ee8c4b8e1ef110e5097259c93fe6d",
  "0x46259c24467f63187be80be75b07e937",
  "0xec4c8f5aa9e7ef60b0279058adb7cc75",
  "0x5e05f96bd2480536f4b4d9bf7508451b",
  "0x05daa789f6ee7764bd95ba8c4f6260e8",
  "0x06980aa3408391e7e3f6f5f8ce2c886e",
  "0x667492c1cb3a99ac27e58819fdc955c6",
  "0xa3968da9d0ba93a422701505dde55e97",
  "0xbbd1e13c9b8e4142f34aca75037bb76c",
  "0xc64cbfe7020d8de542574dc60f876334",
  "0x067c6f37d18e3736b963608efda73d89",
  "0x003eea939b547f212d9c8bf97abf5499",
  "0xfdeb4146d2f2f8f6a9f0228afb0d6a1f"
];

// tokenIds = [
//   "0x88435a2b05a5f9ad073ed00ac9e79dd8",
//   "0x178b1cb25cc2eecb4d3ad2ac558c1695",
//   "0x585aed8a56d3fc4a44cf29d5f6b0ca0f",
//   "0xddf04d9f23f9e86354f3ed71af5703b8",
//   "0xa4fcc28f548ebc30e3f154c470b42e6e",
//   "0xc23fa475a8cb08e542fb0ad140a6b96f",
//   "0xde989317d325aa227d9c41576373ad15",
//   "0xcbdf824467c0dcc859e7a23a65f79774"
// ];

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
          // console.log("Success", data);
          res(data);
        }
      });
    });
  });

  try {
    const resp = await Promise.all(proms);
    console.log(resp.length);
    const allBots = resp.map(res => res.Items[0].relatedChildBot);

    console.log("relatedChildren");
    console.log(allBots);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

getAllBots(tokenIds);
