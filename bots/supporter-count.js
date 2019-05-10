"use strict";

const ethers = require("ethers");
const abi = require("../util/abi");
const contractAddress = process.env.CONTRACT_ADDRESS;

module.exports.supporterCount = async (event, context) => {
  const provider = ethers.getDefaultProvider(process.env.ETHEREUM_NETWORK);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const tokenId = event.pathParameters.tokenId;
    const supporters = await contract.totalNormal(tokenId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        subject: "Support Bots",
        status: supporters.toNumber().toString(),
        color: "green"
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: err
    };
  }
};
