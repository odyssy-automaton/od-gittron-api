// const Octokit = require("@octokit/rest");

class MetaMaker {
  constructor(repoData) {
    this.repoData = repoData;
  }

  generateMetaData() {
    // const metaData = {
    //   size: this.repoData.size
    // };
    // return metaData;

    return JSON.stringify(this.repoData);
  }
}

module.exports = MetaMaker;
