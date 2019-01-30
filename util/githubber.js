const Octokit = require("@octokit/rest");

class GitHubber {
  constructor(gitHubOptions) {
    this.octokit = new Octokit();
    this.gitHubOptions = gitHubOptions;
  }

  getRepo() {
    return this.octokit.repos.get(this.gitHubOptions).then(res => {
      return res.data;
    });
  }

  // async getRepo() {
  //   try {
  //     const result = await this.octokit.repos.get(this.gitHubOptions);
  //     console.log(result.data);

  //     return result.data;
  //   } catch (ex) {
  //     console.log(ex);
  //     return {
  //       error: "Something is wrong"
  //     };
  //   }
  // }

  // async getById(id) {
  //   try {
  //     const result = await this.octokit.request("GET /repositories/:id", {
  //       id
  //     });

  //     console.log(result.data);
  //   } catch (ex) {
  //     console.log(ex);
  //     return {
  //       error: "Something is wrong"
  //     };
  //   }
  // }
}

module.exports = GitHubber;
