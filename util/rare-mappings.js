const rareMappings = {
  armor: {
    layerIndex: 0,
    dnaIndex: 2,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 98],
        svg: ""
      },
      {
        range: [99, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Armor--1.svg"
      }
    ]
  },
  planet: {
    layerIndex: 0,
    dnaIndex: 2,
    randomAssignment: true,
    dataSource: "coverage",
    rangeMapping: [
      {
        range: [0, 97],
        svg: ""
      },
      {
        range: [97, 97],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--1.svg"
      },
      {
        range: [98, 98],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--2.svg"
      },
      {
        range: [99, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Rare--Planet--3.svg"
      }
    ]
  }
};

module.exports = {
  rareMappings
};
