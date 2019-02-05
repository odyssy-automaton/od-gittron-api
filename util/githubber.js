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
        //
        return {
          ghid: res.data.id,
          primaryLanguage: res.data.language
          // updatedAt: res.data.updated_at,
          // createdAt: res.data.created_at,
          // size: res.data.size,
          // stars: res.data.stargazers_count,
          // watchers: res.data.watchers_count,
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

  getCommitCount() {
    const result = this.octokit.repos
      .getParticipationStats(this.gitHubOptions)
      .then(res => {
        return res.data.all.reduce((sum, currentValue) => sum + currentValue);
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}

module.exports = GitHubber;
