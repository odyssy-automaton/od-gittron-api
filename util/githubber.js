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

  getById(id) {
    return this.octokit.request("GET /repositories/:id", { id }).then(res => {
      return res.data;
    });
  }
}

module.exports = GitHubber;
