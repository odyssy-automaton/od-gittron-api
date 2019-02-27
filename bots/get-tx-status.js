"use strict";

const { getByTokenId } = require("../util/dyanamo-queries");
const EtherScanApi = require("../util/etherscan-api");

module.exports.getTxStatus = async (event, context) => {
  try {
    const getRes = await getByTokenId(event.pathParameters.tokenId);
    const bot = getRes.Items[0];

    const api = new EtherScanApi();
    const txStatus = await api.txStatus(bot.txHash);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify({ status: txStatus })
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
