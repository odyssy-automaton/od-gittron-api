"use strict";

const generateTokenID = (repoData, tokenType) => {
  //TODO: Need a way to infer/get generation
  const generation = 0;
  return `${repoData.id}-${tokenType}-${generation}`;
};

module.exports = {
  generateTokenID
};
