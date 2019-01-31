const Githubber = require("../util/githubber");

const githubber = new Githubber({
  repo: "crockswap",
  owner: "skuhlmann"
});

// githubber.getById(56623447).then(res => {
//   console.log(res);
// });

githubber
  .getRepo()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
