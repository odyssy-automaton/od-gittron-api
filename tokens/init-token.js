"use strict";
require("dotenv").config();

const AWS = require("aws-sdk");
const GitHubData = require("../util/github-data");
const {
  generateTokenID,
  generateDNA,
  generateMutationDNA
} = require("../util/meta-maker");
const { tokenCount } = require("../util/dyanamo-queries");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.initToken = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  // TODO: better validation here
  if (
    !reqData.repo ||
    !reqData.repoOwner ||
    !reqData.tokenType ||
    !reqData.address
  ) {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: "Failed validation."
    };
  }

  const githubber = new GitHubData({
    repo: reqData.repo,
    owner: reqData.repoOwner
  });

  try {
    const { data } = await githubber.getRepo();
    githubber.repoData = data;

    const generation = reqData.generation || 0;
    const count = await tokenCount();
    const tokenId = generateTokenID(githubber.repoData.id, reqData, count);
    const stats = await githubber.generateStats();
    const dna = generateDNA(stats, generation);
    const mutationDna = generateMutationDNA(generation);
    const metaAttributes = getMetaAttributes(
      dna,
      mutationDna,
      stats.language,
      generation
    );

    const tokenUriData = {
      name: `Mecha-${reqData.repo}-${reqData.tokenType}`,
      description:
        "The year is 3369 and, throughout the universe, all biological life has been decimated. It's up to the Prime Bots to buidl their own future. They'll need help from the Worker and Support Bots in order to survive.",
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      external_url: `gittron.odyssy.io/bots/${tokenId}`,
      attributes: metaAttributes
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        ghid: githubber.repoData.id.toString(),
        tokenId: tokenId.toString(),
        repo: reqData.repo,
        repoOwner: reqData.repoOwner,
        tokenUriData: tokenUriData,
        createdAt: timestamp,
        updatedAt: timestamp,
        tokenType: reqData.tokenType,
        mined: false,
        verified: false,
        orignalOwnerAddress: reqData.address,
        txHash: null,
        stats,
        generation,
        dna,
        mutationDna
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
