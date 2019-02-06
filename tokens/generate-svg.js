"use strict";

const AWS = require("aws-sdk");

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

    //TODO: now just gen these - see creature-mappings.js

    const payload = {
      svgs: [
        "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--1.svg",
        "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--1.svg",
        "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--2.svg",
        "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--1.svg"
      ],
      name: Item.tokenId,
      timeout: 1000
    };

    const svgReq = {
      FunctionName: "od-sls-svgflatr-dev-phantomsvgflatr",
      Payload: JSON.stringify(payload, null, 2)
    };

    const svgData = await lambda.invoke(svgReq).promise();

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
