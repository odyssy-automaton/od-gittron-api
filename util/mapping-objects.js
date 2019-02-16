const mappingObjects = {
  language: {
    solidity: 0,
    python: 1,
    javascript: 2,
    go: 3,
    java: 4,
    ruby: 5,
    typescript: 41,
    shell: 61,
    html: 81,
    css: 82,
    rust: 91,
    default: 99
  },
  type: {
    "00": "ethdenver"
  }

  //Can add other objects. key should match the dataSource string in creature-mapping.js
};

module.exports = {
  mappingObjects
};
