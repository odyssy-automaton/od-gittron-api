"use strict";

const Octokit = require("@octokit/rest");
const Sentiment = require("sentiment");
const moment = require("moment");

class GitHubData {
  constructor(gitHubOptions) {
    console.log("process.env.GH_CLIENT_ID: " + process.env.GH_CLIENT_ID);
    this.octokit = new Octokit({
      clientId: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET
    });
    this.gitHubOptions = gitHubOptions;
    this.repoData = {};
    this.sentiment = new Sentiment();
  }

  getRepo() {
    return this.octokit.repos.get(this.gitHubOptions);
  }

  getById(id) {
    return this.octokit.request("GET /repositories/:id", { id });
  }

  async generateStats() {
    const stars = this.repoData.stargazers_count + this.repoData.watchers_count;
    const commitSpeed = await this.commitsPer(this.repoData, "days");

    const sentiment = await this.getSentiment();

    return {
      ghid: this.repoData.id,
      language: this.repoData.language.toLowerCase(),
      stars,
      commitSpeed,
      sentiment
    };
  }

  async commitsPer(data, period) {
    const commitCount = await this.getCommitsCount(
      data.created_at,
      data.updated_at
    );
    const diff = moment(data.updated_at).diff(moment(data.created_at), period);
    return commitCount / diff;
  }

  async getCommitsCount() {
    const result = await this.octokit.repos.getParticipationStats(
      this.gitHubOptions
    );

    if (!result.data.all) {
      return 0;
    } else {
      return result.data.all.reduce((sum, currentValue) => sum + currentValue);
    }
  }

  async getSentiment() {
    const message = await this.listCommits();

    const options = {
      extras: {
        // 'heroku': 25
      }
    };
    const result = this.sentiment.analyze(message, options);

    return result.comparative;
    // return result.score;
  }

  async listCommits() {
    const req = {
      ...this.gitHubOptions,
      per_page: 100
    };

    const result = await this.octokit.repos.listCommits(req);
    const allMessages = result.data.map(c => c.commit.message).join(". ");

    return allMessages;
  }
}

module.exports = GitHubData;
