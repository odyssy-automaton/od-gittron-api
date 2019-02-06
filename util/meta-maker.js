"use strict";

const { creatureMappings } = require("../util/creature-mappings");
const { mappingObjects } = require("../util/mapping-objects");

const generateTokenID = (repoData, tokenType, generation) => {
  return `${repoData.id}-${tokenType}-${generation}`;
};

const generateDNA = (repoData, generation) => {
  let dna = new Array(6);

  Object.entries(creatureMappings).forEach(section => {
    let dnaString = repoData[section[1].dataSource];

    if (typeof dnaString === "string") {
      dnaString = mappingObjects[section[1].dataSource][dnaString];
    }
    if (section[1].randomAssignment) {
      dnaString = getRandomInt(99);
    }

    dna[section[1].dnaIndex] = dnaString;
  });

  dna[0] = generation;
  //adding 00 for 'HH - Type' on the end
  dna.push(0);

  return toDnaString(dna);
};

const generateSvgPayload = dnaString => {
  const dna = fromDnaString(dnaString);

  let colors = [];
  let svgs = [];

  Object.entries(creatureMappings).forEach(section => {
    const res = mapToSvg(dna[section[1].dnaIndex], section[0]);

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

const toDnaString = numberArray => {
  return numberArray.map(number => ("0" + number).slice(-2)).join("-");
};

const fromDnaString = dnaString => {
  return dnaString.split("-").map(dna => +dna);
};

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

Number.prototype.between = function(a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  return this >= min && this <= max;
};

module.exports = {
  generateTokenID,
  generateDNA,
  generateSvgPayload,
  toDnaString,
  fromDnaString
};
