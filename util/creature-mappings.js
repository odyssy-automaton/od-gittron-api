const creatureMappings = {
  body: {
    layerIndex: 0,
    dnaIndex: 2,
    randomAssignment: false,
    dataSource: "language",
    rangeMapping: [
      {
        range: [0, 0],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--1.svg"
      },
      {
        range: [1, 1],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--2.svg"
      },
      {
        range: [2, 2],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--3.svg"
      },
      {
        range: [3, 3],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--4.svg"
      },
      {
        range: [4, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--5.svg"
      }
    ]
  },
  legs: {
    layerIndex: 1,
    dnaIndex: 4,
    randomAssignment: true,
    dataSource: "commitSpeed",
    rangeMapping: [
      {
        range: [0, 9],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--1.svg"
      },
      {
        range: [10, 19],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--2.svg"
      },
      {
        range: [20, 29],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--3.svg"
      },
      {
        range: [30, 39],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--4.svg"
      },
      {
        range: [40, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--5.svg"
      }
    ]
  },
  arms: {
    layerIndex: 2,
    dnaIndex: 3,
    randomAssignment: true,
    dataSource: "stars",
    rangeMapping: [
      {
        range: [0, 9],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--1.svg"
      },
      {
        range: [10, 19],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--2.svg"
      },
      {
        range: [20, 29],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--3.svg"
      },
      {
        range: [30, 39],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--4.svg"
      },
      {
        range: [40, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--5.svg"
      }
    ]
  },
  head: {
    layerIndex: 3,
    dnaIndex: 1,
    randomAssignment: true,
    dataSource: "sentiment",
    rangeMapping: [
      {
        range: [0, 9],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--1.svg"
      },
      {
        range: [10, 19],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--2.svg"
      },
      {
        range: [20, 29],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--3.svg"
      },
      {
        range: [30, 39],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--4.svg"
      },
      {
        range: [40, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--5.svg"
      }
    ]
  },
  primaryColor: {
    layerIndex: 0,
    dnaIndex: 5,
    randomAssignment: true,
    rangeMapping: [
      {
        range: [0, 9],
        color: "#f47142"
      },
      {
        range: [10, 19],
        color: "#b58939"
      },
      {
        range: [20, 29],
        color: "#ede742"
      },
      {
        range: [30, 39],
        color: "#b1e540"
      },
      {
        range: [40, 99],
        color: "#48dd40"
      }
    ]
  },
  secondaryColor: {
    layerIndex: 1,
    dnaIndex: 6,
    randomAssignment: true,
    rangeMapping: [
      {
        range: [0, 9],
        color: "#3ff4a3"
      },
      {
        range: [10, 19],
        color: "#38f7e4"
      },
      {
        range: [20, 29],
        color: "#31b3f9"
      },
      {
        range: [30, 39],
        color: "#2e4bf2"
      },
      {
        range: [40, 99],
        color: "#6629e8"
      }
    ]
  }
};

module.exports = {
  creatureMappings
};
