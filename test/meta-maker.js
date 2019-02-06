const {
  generateSvgPayload,
  generateDNA,
  fromDnaString
} = require("../util/meta-maker");

const metaData = {
  commitSpeed: 0.6604177825388323,
  ghid: 15452919,
  language: "go",
  sentiment: -0.005597629239380968,
  starts: 44992
};

const repoData = {
  repo: "crockswap",
  tokenId: "56289855-master-0",
  ghid: "56289855",
  updatedAt: 1549467090853,
  createdAt: 1549467090853,
  tokenUriData: {
    name: "56289855-master-0",
    description: "Spend less. Cook once. Eat for days.",
    image: "https://s3.aws/somepath/56289855-master-0.png",
    meta: {
      sentiment: -0.05286343612334802,
      language: "javascript",
      stars: 0,
      commitSpeed: 0.02,
      ghid: 56289855
    }
  },
  repoOwner: "skuhlmann"
};

const dnaString = "00-32-06-36-95-50-24-00";

const res = generateSvgPayload(dnaString);
// const res = generateDNA(repoData.tokenUriData.meta, 0);
// const res = fromDnaString("00-01-57-83-52-34-62-00");

console.log(res);
