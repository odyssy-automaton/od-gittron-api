const { generateSvgPayload } = require("../util/meta-maker");

const metaData = {
  commitSpeed: 0.6604177825388323,
  ghid: 15452919,
  language: "go",
  sentiment: -0.005597629239380968,
  starts: 44992
};

const res = generateSvgPayload(metaData);

console.log(res);
