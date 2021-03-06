"use strict";
require("dotenv").config();

const GitHubData = require("../util/github-data");
const {
  generateTokenID,
  generateDNA,
  generateMutationDNA,
  getMetaAttributes
} = require("../util/meta-maker");
const { uuidRand, addRecord } = require("../util/dyanamo-queries");

module.exports.generatePrimeBot = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  if (!reqData.repo || !reqData.repoOwner || !reqData.address) {
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

  const githubber = new GitHubData({
    repo: reqData.repo,
    owner: reqData.repoOwner
  });

  try {
    const { data } = await githubber.getRepo();
    githubber.repoData = data;

    const generation = reqData.generation || 0;
    const tokenType = "prime";
    const uuid = await uuidRand();
    const tokenId = generateTokenID(
      githubber.repoData.id,
      reqData.address,
      tokenType,
      uuid,
      generation
    );
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
      name: `Mecha ${reqData.repo} ${tokenType}`,
      description:
        "The year is 3369 and, throughout the universe, all biological life has been decimated. It's up to the Prime Bots to buidl their own future. They'll need help from the Buidl and Support Bots in order to survive.",
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      external_url: `https://gittron.me/bots/${tokenId}`,
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
        tokenType,
        mined: false,
        verified: false,
        disabled: false,
        hatched: false,
        orignalOwnerAddress: reqData.address,
        txHash: null,
        forked: githubber.repoData.fork,
        stats,
        generation,
        dna,
        mutationDna,
        uuid
      }
    };

    await addRecord(params);

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
