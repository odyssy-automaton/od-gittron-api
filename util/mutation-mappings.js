const mutationMappings = {
  armor: {
    layerIndex: 1,
    dnaIndex: 0,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 79],
        name: "",
        svg: "",        
      },
      {
        range: [80, 99],
        name: "Sparkling Armor",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Armor--1.svg"
      }
    ]
  },
  planet: {
    layerIndex: 0,
    dnaIndex: 1,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 39],
        name: "",
        svg: ""
      },
      {
        range: [40, 59],
        name: "Gas Giant",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--1.svg"
      },
      {
        range: [60, 79],
        name: "Ringed Planet",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--2.svg"
      },
      {
        range: [80, 99],
        name: "SuperEarth",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--3.svg"
      }
    ]
  },
  energy: {
    layerIndex: 1,
    dnaIndex: 2,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 59],
        name: "",
        svg: ""
      },
      {
        range: [60, 79],
        name: "Force Field",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Forcefield--1.svg"
      },
      {
        range: [80, 99],
        name: "Electrified",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Energy--1.svg"
      }
    ]
  },
  back: {
    layerIndex: 0,
    dnaIndex: 3,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 79],
        name: "",
        svg: ""
      },
      {
        range: [80, 99],
        name: "Blast Pack",
        svg:
          "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Back--1.svg"
      }
    ]
  }
};

module.exports = {
  mutationMappings
};
