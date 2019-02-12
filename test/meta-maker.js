const {
  generateSvgPayload,
  generateDNA,
  alterDNA,
  fromDnaString,
  generateTokenID
} = require("../util/meta-maker");

const metaData = {
  commitSpeed: 0.6604177825388323,
  ghid: 15452919,
  language: "go",
  sentiment: -0.005597629239380968,
  starts: 44992
};

const repoData = {
  repo: "wandering-bloom",
  tokenId: "56623447-master-0",
  ghid: "56623447",
  generation: 0,
  updatedAt: 1549492127491,
  dna: "00-47-ed-14-87-57-76-00",
  createdAt: 1549492127491,
  tokenType: "master",
  tokenUriData: {
    name: "56623447-master-0",
    description: "Pineapple rock, lemon platt, butter scotch.",
    image: "https://s3.amazonaws.com/od-flat-svg/56623447-master-0.png",
    meta: {
      sentiment: -0.046357615894039736,
      language: "ruby",
      stars: 0,
      commitSpeed: 0.0022002200220022,
      ghid: 56623447
    }
  },
  repoOwner: "skuhlmann"
};

const reqData = {
  repo: "od-gittron-api",
  repoOwner: "odyssy-automaton",
  tokenType: "master",
  address: "0x83aB8e31df35AA3281d630529C6F4bf5AC7f7aBF",
  generation: "0"
};

const dnaString = "00-32-06-36-95-50-24-00";

// const res = generateSvgPayload(dnaString);
// const res = generateDNA(repoData.tokenUriData.meta, 0);
// const res = fromDnaString("00-01-57-83-52-34-62-00");

// const res = generateTokenID(repoData, reqData);

const res = alterDNA(dnaString);

console.log(res);
