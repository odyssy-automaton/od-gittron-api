const CreatureMaker = require("../util/creature-maker");
const { creatureMappings } = require("../util/creature-mappings");
const { languageMapping } = require("../util/mapping-objects");

Number.prototype.between = function(a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  return this > min && this < max;
};

const mapToSvg = data => {
  const svgs = [];
  const languageSvg = creatureMappings.body.rangeMapping.find(r => {
    return languageMapping[data.language].between(r.range[0], r.range[1]);
  });

  svgs[creatureMappings.body.layerIndex] = languageSvg.svg;

  return {
    svgs,
    name: data.ghid,
    timeout: 1000
  };
};

const github = {
  repo: "go-ethereum",
  owner: "ethereum"
};

const creatureMaker = new CreatureMaker(github);

creatureMaker
  .generateCreatureData()
  .then(res => {
    const result = mapToSvg(res);
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
