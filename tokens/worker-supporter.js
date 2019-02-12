"use strict";
require("dotenv").config();

const AWS = require("aws-sdk");
const { generateTokenID, alterDNA } = require("../util/meta-maker");
const { tokenCount, getByTokenId } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.workerSupporter = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  //gen new dna with rando colors
  //

  try {
    const count = await tokenCount();
    const getRes = await getByTokenId(reqData.masterTokenId);
    const masterToken = getRes.Items[0];

    const tokenId = generateTokenID(
      masterToken.ghid,
      reqData,
      count.Count,
      masterToken.generation
    );

    const dna = alterDNA(masterToken.dna);

    const tokenUriData = {
      name: tokenId,
      description: dna,
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      meta: masterToken.tokenUriData.meta
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        ghid: masterToken.ghid.toString(),
        tokenId: tokenId.toString(),
        repo: masterToken.repo,
        repoOwner: masterToken.repoOwner,
        tokenUriData,
        createdAt: timestamp,
        updatedAt: timestamp,
        tokenType: reqData.tokenType,
        mined: false,
        orignalOwnerAddress: reqData.address,
        txHash: null,
        generation: masterToken.generation,
        dna
      }
    };

    const putItem = new Promise((res, rej) => {
      dynamoDb.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          console.log("Success", data);
          res("Hi, insert data completed");
        }
      });
    });

    await putItem;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: error
    };
  }
};
