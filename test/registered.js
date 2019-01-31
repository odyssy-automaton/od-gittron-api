const { registered } = require("../repos/registered");

const event = {
  pathParameters: {
    repo: "crockswap",
    repoOwner: "skuhlmann"
  }
};

process.env.DYNAMODB_TABLE = "od-gittron-api-dev";
//how to mock dynamodb?

function callback(err, msg) {
  console.log(err);
  console.log(msg);
}

registered(event, {}, callback);
