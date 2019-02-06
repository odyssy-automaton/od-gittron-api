require("dotenv").config();

const CreatureMaker = require("../util/creature-maker");
const { creatureMappings } = require("../util/creature-mappings");
const { languageMapping } = require("../util/mapping-objects");

Number.prototype.between = function(a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  return this > min && this < max;
};

const processParts = data => {
  //TODO: this relies on the order of entries to layer the svgs
  colors = [];
  svgs = [];
  Object.entries(creatureMappings).forEach(section => {
    let dataSource = data[section[1].dataSource];
    if (section[1].randomAssignment)
      dataSource = creatureMaker.getRandomInt(99);
    console.log(dataSource);

    // const res = mapToSvg(data.Source, section[0]);
    // if (res.color) colors[section.layerOrder] = res.color;
    // if (res.svg) svgs[section.layerOrder] = res.svg;
  });

  return {
    svgs,
    colors
  };
};

const mapToSvg = (data, section) => {
  return creatureMappings[section].rangeMapping.find(r => {
    return languageMapping[data].between(r.range[0], r.range[1]);
  });
};

const github = {
  repo: "go-ethereum",
  owner: "ethereum"
};

const creatureMaker = new CreatureMaker(github);

creatureMaker
  .generateCreatureData()
  .then(res => {
    const result = processParts(res);

    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
