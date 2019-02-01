"use strict";

const Octokit = require("@octokit/rest");

class GitHubber {
  constructor(gitHubOptions) {
    this.octokit = new Octokit();
    this.gitHubOptions = gitHubOptions;
  }

  generateMetaData() {
    return this.octokit.repos
      .get(this.gitHubOptions)
      .then(res => {
        return {
          ghid: res.data.id,
          updatedAt: res.data.updated_at,
          createdAt: res.data.created_at,
          size: res.data.size,
          stars: res.data.stargazers_count,
          watchers: res.data.watchers_count,
          primaryLanguage: res.data.language,
          openIssues: res.data.open_issues_count
        };
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  getRepo() {
    return this.octokit.repos
      .get(this.gitHubOptions)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  getById(id) {
    return this.octokit.request("GET /repositories/:id", { id }).then(res => {
      return res.data;
    });
  }
}

module.exports = GitHubber;
