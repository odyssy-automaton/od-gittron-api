//take repo and owner
//query gh
//  -  reject if not found
//build stats
//gen id
//fake image name
//insert into db
"use strict";

const GitHubData = require("../util/github-data");
const { generateTokenID } = require("../util/meta-maker");

const create = async event => {
  const timestamp = new Date().getTime();
  const reqData = event.body;

  if (typeof reqData.repo !== "string" || !reqData.tokenType) {
    console.error("Validation Failed");
    const response = {
      statusCode: 401,
      body: JSON.stringify({ message: "Validation Failed" })
    };
    return response;
  }

  const githubber = new Githubber({
    repo: reqData.repo,
    owner: reqData.repoOwner
  });

  try {
    const { data } = await githubber.getRepo();
    const tokenId = generateTokenID(data, reqData.tokenType);
    //

    // const ghStats =

    //TODO: This assumes we are guessing the png path - do we generate that first?
    //TODO: Worried about BC transaction failing

    console.log(tokenUriMeta);
    return (tokenUriMeta = {
      name: tokenId,
      description: data.description,
      image: `https://s3.aws/somepath/${tokenId}.png`
      // meta: result.Item.metaData
    });
  } catch (error) {
    return error;
  }
};

const req = {
  body: {
    repo: "go-ethereum",
    repoOwner: "ethereum",
    tokenType: "base"
  }
};

create(req);
