const creatureMappings = {
  body: {
    layerIndex: 0,
    rangeMapping: [
      {
        range: [0, 9],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--1.svg"
      },
      {
        range: [10, 19],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--2.svg"
      },
      {
        range: [20, 29],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--3.svg"
      },
      {
        range: [30, 39],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--4.svg"
      },
      {
        range: [40, 99],
        svg: "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--5.svg"
      }
    ]
  },
  legs: {
    layerOrder: 1,
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
    layerOrder: 2,
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
    layerOrder: 3,
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
    rangeMapping: [
      {
        range: [0, 9],
        color: ""
      },
      {
        range: [10, 19],
        color: ""
      },
      {
        range: [20, 29],
        color: ""
      },
      {
        range: [30, 39],
        color: ""
      },
      {
        range: [40, 99],
        color: ""
      }
    ]
  },
  secondaryColor: {
    rangeMapping: [
      {
        range: [0, 9],
        color: ""
      },
      {
        range: [10, 19],
        color: ""
      },
      {
        range: [20, 29],
        color: ""
      },
      {
        range: [30, 39],
        color: ""
      },
      {
        range: [40, 99],
        color: ""
      }
    ]
  }
};

module.exports = {
  creatureMappings
};

// // to select a 'string' based body part svg
// const bodySvg = mapping.body[repo.stats.language];

// // to select a 'number' based body part svg
// const matchingRange = mapping.arms.ranges.find(r => {
//   return repo.stats.pullsCount.between(r.range[0], r.range[1]);
// });
// const legsSvg = matchingRange.svg;

// Number.prototype.between = (a, b) => {
//   var min = Math.min(a, b),
//     max = Math.max(a, b);

//   return this > min && this < max;
// };

// const repoStats = {
//   b
// };
