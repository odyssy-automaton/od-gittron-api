"use strict";

const { getByTokenId, updateBot } = require("../util/dyanamo-queries");
const EtherScanApi = require("../util/etherscan-api");

module.exports.updateTxStatus = async (event, context) => {
  const reqData = JSON.parse(event.body);
  const reqKeys = Object.keys(reqData);
  const hasValidKey = reqKeys.find(key => {
    return key === "mined" || key === "txHash" || key === "disabled";
  });

  if (!hasValidKey && reqKeys.length === 1) {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: "Failed validation."
    };
  }

  try {
    const getRes = await getByTokenId(event.pathParameters.tokenId);
    const bot = getRes.Items[0];

    console.log(bot.txHash.length);

    if (reqData.disabled && bot.txHash !== null && bot.txHash.length === 66) {
      console.log("checking etherscan");
      const api = new EtherScanApi();
      const txStatus = await api.getTransactionReceipt(bot.txHash);
      console.log(txStatus);

      //TODO: Unknown if this is a valid pending status
      const status = txStatus.result ? txStatus.result.status : "pending";
      if (status !== "0x0") {
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.ORIGIN
          },
          body: JSON.stringify({ message: "Cannot disable at this time" })
        };
      }
    }

    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        tokenId: event.pathParameters.tokenId,
        ghid: bot.ghid
      },
      ExpressionAttributeValues: {
        ":updatedAt": new Date().getTime()
      },
      UpdateExpression: `SET ${reqKeys[0]} = :${
        reqKeys[0]
      }, updatedAt = :updatedAt`,
      ReturnValues: "ALL_NEW"
    };

    updateParams.ExpressionAttributeValues[`:${reqKeys[0]}`] =
      reqData[reqKeys[0]];

    await updateBot(updateParams);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify({ message: "Updated" })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: err
    };
  }
};
