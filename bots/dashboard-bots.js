"use strict";

const { getByTokenId } = require("../util/dyanamo-queries");

module.exports.dashboardBots = async (event, context) => {
  const reqData = JSON.parse(event.body);

  try {
    const botProms = reqData.tokenIds.map(tokenId => {
      return getByTokenId(tokenId);
    });

    const resp = await Promise.all(botProms);
    const allBots = resp.map(res => res.Items[0]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify(allBots)
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
