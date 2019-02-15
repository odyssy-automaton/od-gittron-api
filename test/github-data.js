require("dotenv").config();
const GitHubData = require("../util/github-data");

const ghData = {
  repo: "timernator",
  owner: "dekanbro"
};

const tester = async () => {
  githubData = new GitHubData(ghData);

  try {
    const { data } = await githubData.getRepo();
    githubData.repoData = data;

    // const repoData = await githubData.getRepo();
    // const commitsCount = await githubData.getCommitsCount();
    const stats = await githubData.generateStats();
    // const file = await githubData.getVerificationAddress();
    // console.log(repoData);
    console.log(stats);
  } catch (err) {
    console.log(err);
  }
};

tester();
