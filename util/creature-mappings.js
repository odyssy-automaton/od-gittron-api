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
        color: '#e2db50',
        name: 'Golden Prime'
      },
      {
        range: [10, 19],
        color: 'e4e4f4',
        name: 'Glacial Blue'
      },
      {
        range: [20, 29],
        color: '#f7f7f7',
        name: 'White Lightning'
      },
      {
        range: [30, 39],
        color: '#e6ecee',
        name: 'Silver Lining'
      },
      {
        range: [40, 49],
        color: '#7ee05a',
        name: 'Mossy Green'
      },
      {
        range: [50, 59],
        color: '#ab0cbc',
        name: 'Performant Purple'
      },
      {
        range: [60, 99],
        color: "#3a2f3a",
        name: 'Raw Metal'
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
        color: '#e2db50',
        name: 'Golden Prime'
      },
      {
        range: [10, 19],
        color: '#ab0cbc',
        name: 'Performant Purple'
      },
      {
        range: [20, 29],
        color: '#b7410e',
        name: 'Rusty'
      },
      {
        range: [30, 39],
        color: '#1fa33b',
        name: 'Foresty'
      },
      {
        range: [40, 49],
        color: '#19d8b4',
        name: 'Seafoam'
      },
      {
        range: [50, 59],
        color: '#0049ff',
        name: 'Processor Blue'
      },
      {
        range: [60, 99],
        color: '#3a2f3a',
        name: 'Raw Metal'
      }
    ]
  }
};

module.exports = {
  creatureMappings
};
