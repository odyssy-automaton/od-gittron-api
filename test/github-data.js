require("dotenv").config();
const GitHubData = require("../util/github-data");

const ghData = {
  repo: "od-gittron-contract",
  owner: "odyssy-automaton"
};

const tester = async () => {
  githubData = new GitHubData(ghData);

  try {
    const repoData = await githubData.getRepo();
    // const commitsCount = await githubData.getCommitsCount();
    // const file = await githubData.getVerificationAddress();
    console.log(repoData);
  } catch (err) {
    console.log(err);
  }
};

tester();
