"use strict";

const AWS = require("aws-sdk");
const { getByTokenId, updateBot } = require("../util/dyanamo-queries");
const { generateSvgPayload, addMutationSvgs } = require("../util/meta-maker");

const lambda = new AWS.Lambda({
  region: "us-east-1"
});

module.exports.hatch = async (event, context) => {
  // get bot
  // TODO: More validation needed?
  // FE is checking the tokenId against the contract, nothing else needed now
  // Generate png
  // Update record hatched=true

  try {
    const getRes = await getByTokenId(event.pathParameters.tokenId);
    const bot = getRes.Items[0];

    if (!bot) {
      throw "bot not found";
    }

    const { svgs, colors } = generateSvgPayload(bot.dna);
    const htmlGenPayload = {
      outputName: bot.tokenId,
      templateVars: [
        { name: "primaryColor", value: colors[0] },
        { name: "secondaryColor", value: colors[1] },
        { name: "name", value: bot.repo }
      ]
    };
    const html = await lambda
      .invoke({
        FunctionName: "od-sls-htmlgen-dev-htmlgen",
        Payload: JSON.stringify(htmlGenPayload, null, 2)
      })
      .promise();

    const htmlRes = JSON.parse(html.Payload);

    const svgWithMutations = addMutationSvgs(bot.mutationDna, svgs);

    const svgGenPayload = {
      svgs: svgWithMutations,
      html: htmlRes.url,
      name: bot.tokenId,
      timeout: 1000
    };

    const svgData = await lambda
      .invoke({
        FunctionName: "od-sls-svgflatr-dev-phantomsvgflatr",
        Payload: JSON.stringify(svgGenPayload, null, 2)
      })
      .promise();

    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        tokenId: event.pathParameters.tokenId,
        ghid: bot.ghid
      },
      ExpressionAttributeValues: {
        ":updatedAt": new Date().getTime(),
        ":hatched": true
      },
      UpdateExpression: `SET hatched = :hatched, updatedAt = :updatedAt`,
      ReturnValues: "ALL_NEW"
    };

    await updateBot(updateParams);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: svgData.Payload
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
