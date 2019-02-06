const GitHubData = require("../util/github-data");

const ghData = {
  repo: "crockswap",
  owner: "skuhlmann"
};

const tester = async () => {
  githubData = new GitHubData(ghData);

  try {
    const repoData = await githubData.getRepo();
    const commitsCount = await githubData.getCommitsCount();

    console.log(commitsCount);
  } catch (err) {
    console.log(err);
  }
};

tester();
