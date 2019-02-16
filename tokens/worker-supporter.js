"use strict";
require("dotenv").config();

const AWS = require("aws-sdk");
const { generateTokenID, alterDNA } = require("../util/meta-maker");
const { uuidRand, getByTokenId } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.workerSupporter = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  //TODO: Validation

  try {
    const uuid = await uuidRand();
    const getRes = await getByTokenId(reqData.masterTokenId);
    const masterToken = getRes.Items[0];

    const tokenId = generateTokenID(
      masterToken.ghid,
      reqData,
      uuid,
      masterToken.generation
    );

    const dna = alterDNA(masterToken.dna);
    const { primaryColor, secondaryColor } = getColors(dna);

    const attributes = [...masterToken.tokenUriData.attributes];
    attributes[0].value = primaryColor;
    attributes[1].value = secondaryColor;

    const tokenUriData = {
      name: tokenId,
      description: dna,
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      external_url: `gittron.odyssy.io/bots/${tokenId}`,
      attributes
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
        stats: masterToken.stats,
        generation: masterToken.generation,
        dna,
        mutationDna: masterToken.mutationDna,
        uuid
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
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: error
    };
  }
};
