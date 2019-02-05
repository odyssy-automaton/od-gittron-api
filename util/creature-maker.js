// const Githubber = require("./githubber");
require("dotenv").config();
const Octokit = require("@octokit/rest");
const Sentiment = require("sentiment");
const moment = require("moment");

class CreatureMaker {
  constructor(repo) {
    // this.githubber = new Githubber({
    //   repo: repo.repo,
    //   owner: repo.owner
    // });
    this.octokit = new Octokit({
      clientId: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET
    });
    this.gitHubOptions = repo;
    this.sentiment = new Sentiment();
  }

  async generateCreatureData() {
    const { data } = await this.octokit.repos.get(this.gitHubOptions);
    const stars = data.stargazers_count + data.watchers_count;
    const commitSpeed = await this.commitsPer(data, "days");

    const sentiment = await this.getSentiment();

    return {
      ghid: data.id,
      language: data.language.toLowerCase(),
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

    return result.data.all.reduce((sum, currentValue) => sum + currentValue);
  }

  async getSentiment() {
    const message = await this.listCommits();

    const options = {
      extras: {
        // 'heroku': 25
      }
    };
    const result = this.sentiment.analyze(message, options);

    // return result.comparative
    return result.score;
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

module.exports = CreatureMaker;
