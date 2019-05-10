require("dotenv").config();
const GitHubData = require("../util/github-data");

const ghData = {
  // repo: "go-ethereum",
  repo: "od-gittron-api",
  // owner: "strindbergman"
  owner: "odyssy-automaton"
};

const tester = async () => {
  githubData = new GitHubData(ghData);

  try {
    const { data } = await githubData.getRepo();
    githubData.repoData = data;

    console.log(githubData.repoData);
    console.log(githubData.repoData.fork);

    // const repoData = await githubData.getRepo();
    // const commitsCount = await githubData.getCommitsCount();
    // const stats = await githubData.generateStats();
    // const file = await githubData.getVerificationAddress();
    // console.log(repoData);
    // console.log(stats);
  } catch (err) {
    console.log(err);
  }
};

tester();
