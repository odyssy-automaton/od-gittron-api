"use strict";
require("dotenv").config();

const {
  generateTokenID,
  morphDNA,
  generateMutationDNA,
  getMetaAttributes
} = require("../util/meta-maker");
const {
  uuidRand,
  getByTokenId,
  addBot,
  updateBot
} = require("../util/dyanamo-queries");

module.exports.morph = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  if (!reqData.ancestorTokenId || !reqData.address) {
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

  try {
    const uuid = await uuidRand();
    const getRes = await getByTokenId(reqData.ancestorTokenId);
    const ancestorToken = getRes.Items[0];
    const tokenType = "prime";
    const generation = (+ancestorToken.generation + 1).toString();

    const tokenId = generateTokenID(
      ancestorToken.ghid,
      reqData.address,
      tokenType,
      uuid,
      generation
    );

    const dna = morphDNA(ancestorToken.dna);

    const mutationDna = generateMutationDNA(
      generation,
      ancestorToken.mutationDna
    );

    const metaAttributes = getMetaAttributes(
      dna,
      mutationDna,
      ancestorToken.stats.language,
      generation
    );

    const tokenUriData = {
      name: `Mecha ${ancestorToken.repo} ${tokenType}`,
      description:
        "The year is 3369 and, throughout the universe, all biological life has been decimated. It's up to the Prime Bots to buidl their own future. They'll need help from the Buidl and Support Bots in order to survive.",
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      external_url: `https://gittron.me/bots/${tokenId}`,
      attributes: metaAttributes
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        ghid: ancestorToken.ghid.toString(),
        tokenId: tokenId.toString(),
        repo: ancestorToken.repo,
        repoOwner: ancestorToken.repoOwner,
        tokenUriData,
        createdAt: timestamp,
        updatedAt: timestamp,
        tokenType: tokenType,
        mined: false,
        verified: true,
        disabled: false,
        hatched: false,
        orignalOwnerAddress: reqData.address,
        txHash: null,
        stats: ancestorToken.stats,
        forked: ancestorToken.forked,
        generation: generation,
        dna,
        mutationDna: mutationDna,
        uuid,
        relatedAncestorBot: ancestorToken.tokenId
      }
    };

    await addBot(params);

    const ancestorBotParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        tokenId: ancestorToken.tokenId,
        ghid: ancestorToken.ghid
      },
      ExpressionAttributeValues: {
        ":relatedChildBot": tokenId,
        ":updatedAt": timestamp
      },
      UpdateExpression: `SET relatedChildBot = :relatedChildBot, updatedAt = :updatedAt`,
      ReturnValues: "ALL_NEW"
    };

    await updateBot(ancestorBotParams);

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
