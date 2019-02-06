"use strict";

const { creatureMappings } = require("../util/creature-mappings");
const { mappingObjects } = require("../util/mapping-objects");

const generateTokenID = (repoData, tokenType) => {
  //TODO: Need a way to infer/get generation
  const generation = 0;
  return `${repoData.id}-${tokenType}-${generation}`;
};

const generateSvgPayload = metaData => {
  let colors = [];
  let svgs = [];
  Object.entries(creatureMappings).forEach(section => {
    let dataSource = metaData[section[1].dataSource];

    if (typeof dataSource === "string") {
      dataSource = mappingObjects[section[1].dataSource][dataSource];
    }

    if (section[1].randomAssignment) {
      dataSource = getRandomInt(99);
    }

    const res = mapToSvg(dataSource, section[0]);

    if (res.color) colors[section[1].layerIndex] = res.color;
    if (res.svg) svgs[section[1].layerIndex] = res.svg;
  });

  return {
    svgs,
    colors
  };
};

const mapToSvg = (value, section) => {
  return creatureMappings[section].rangeMapping.find(r => {
    return value.between(r.range[0], r.range[1]);
  });
};

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

Number.prototype.between = function(a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  return this > min && this < max;
};

module.exports = {
  generateTokenID,
  generateSvgPayload
};
