"use strict";
require("dotenv").config();

const { generateTokenID, alterDNA, getColors } = require("../util/meta-maker");
const {
  uuidRand,
  getByTokenId,
  addRecord
} = require("../util/dyanamo-queries");

module.exports.cloneBot = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  if (!reqData.masterTokenId || !reqData.tokenType || !reqData.address) {
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
    const getRes = await getByTokenId(reqData.masterTokenId);
    const masterToken = getRes.Items[0];

    const tokenId = generateTokenID(
      masterToken.ghid,
      reqData.address,
      reqData.tokenType,
      uuid,
      masterToken.generation
    );

    const dna = alterDNA(masterToken.dna);
    const { primaryColor, secondaryColor } = getColors(dna);

    const attributes = [...masterToken.tokenUriData.attributes];
    attributes[0].value = primaryColor;
    attributes[1].value = secondaryColor;

    const tokenUriData = {
      name: `${reqData.tokenType}er ${tokenId}`,
      description:
        "The year is 3369 and, throughout the universe, all biological life has been decimated. It's up to the Prime Bots to buidl their own future. They'll need help from the Buidl and Support Bots in order to survive.",
      image: `https://s3.amazonaws.com/od-flat-svg/${tokenId}.png`,
      external_url: `https://gittron.me/bots/${tokenId}`,
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
        disabled: false,
        hatched: false,
        orignalOwnerAddress: reqData.address,
        txHash: null,
        stats: masterToken.stats,
        generation: masterToken.generation,
        forked: masterToken.forked,
        dna,
        mutationDna: masterToken.mutationDna,
        uuid,
        relatedPrimeBot: masterToken.tokenId
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
