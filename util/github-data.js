"use strict";

const Octokit = require("@octokit/rest");
const Sentiment = require("sentiment");
const moment = require("moment");

class GitHubData {
  constructor(gitHubOptions) {
    this.octokit = new Octokit({
      auth: {
        clientId: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET
      }
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

  getContents() {
    const query = {
      ...this.gitHubOptions,
      path: "/"
    };
    return this.octokit.repos.getContents(query);
  }

  getBlob(sha) {
    const query = {
      ...this.gitHubOptions,
      file_sha: sha
    };

    return this.octokit.git.getBlob(query);
  }

  async getVerificationAddress() {
    const { data } = await this.getContents();
    const file = data.find(file => file.name === ".gittron");

    if (file) {
      const blob = await this.getBlob(file.sha);
      const buff = Buffer.from(blob.data.content, "base64");
      const contents = buff.toString("utf-8");

      return contents.replace(/ /g, "");
    } else {
      return false;
    }
  }

  async generateStats() {
    let stars =
      this.repoData.stargazers_count + this.repoData.watchers_count || 0;
    let commitSpeed = (await this.commitsPer(this.repoData, "days")) || 0;

    let sentiment = (await this.getSentiment()) || 0;
    const language = this.repoData.language
      ? this.repoData.language.toLowerCase()
      : "default";

    return {
      ghid: this.repoData.id,
      language,
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
    const speed =
      commitCount /
      moment(data.updated_at).diff(moment(data.created_at), period);

    return speed === Infinity ? 99 : speed;
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
