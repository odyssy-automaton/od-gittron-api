require("dotenv").config();
const GitHubData = require("../util/github-data");

const ghData = {
  repo: "crockswap",
  // repo: "wandering-bloom",
  owner: "skuhlmann"
};

const tester = async () => {
  githubData = new GitHubData(ghData);

  try {
    // const repoData = await githubData.getRepo();
    // const commitsCount = await githubData.getCommitsCount();
    const file = await githubData.getVerificationAddress();

    const addr = "0x83aB8e31df35AA3281d630529C6F4bf5AC7f7aBF";

    console.log(file);
    console.log(addr);

    console.log(parseInt(addr) === parseInt(file));

    console.log(parseInt(addr));
    console.log(parseInt(file));
  } catch (err) {
    console.log(err);
  }
};

tester();
