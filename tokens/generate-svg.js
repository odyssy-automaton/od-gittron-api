"use strict";

const AWS = require("aws-sdk");
const { generateSvgPayload } = require("../util/meta-maker");

const lambda = new AWS.Lambda({
  region: "us-east-1"
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.generateSvg = async (event, context) => {
  const reqData = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      ghid: reqData.ghid,
      tokenId: reqData.tokenId
    }
  };

  const getItem = new Promise((res, rej) => {
    dynamoDb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        rej(err);
      } else {
        // console.log("Success", data);
        res(data);
      }
    });
  });

  try {
    const { Item } = await getItem;

    const { svgs, colors } = generateSvgPayload(Item.dna);

    const htmlGenPayload = {
      outputName: Item.tokenId,
      primaryColor: colors[0],
      secondaryColor: colors[1],
      name: Item.repo
    };
    const html = await lambda
      .invoke({
        FunctionName: "od-sls-htmlgen-dev-htmlgen",
        Payload: JSON.stringify(htmlGenPayload, null, 2)
      })
      .promise();

    const htmlRes = JSON.parse(html.Payload);

    const svgGenPayload = {
      svgs,
      html: htmlRes.url,
      name: Item.tokenId,
      timeout: 1000
    };

    const svgData = await lambda
      .invoke({
        FunctionName: "od-sls-svgflatr-dev-phantomsvgflatr",
        Payload: JSON.stringify(svgGenPayload, null, 2)
      })
      .promise();

    return {
      statusCode: 200,
      // headers: {
      //   "Content-Type": "application/json",
      //   "Access-Control-Allow-Origin": "*"
      // },
      body: svgData.Payload
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "no robot."
    };
  }
};
