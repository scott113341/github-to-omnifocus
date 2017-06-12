const GitHubApi = require('github');

class GitHub {

  constructor (githubToken) {
    this.gh = new GitHubApi({ debug: false });
    this.gh.authenticate({
      type: 'token',
      token: githubToken
    });
  }

  async getAllIssues () {
    const issues = [];

    let res = await this.gh.issues.getAll({ filter: 'assigned', state: 'all', per_page: 100 });
    issues.push(...res.data.map(transform));

    while (this.gh.hasNextPage(res)) {
      res = await this.gh.getNextPage(res);
      issues.push(...res.data.map(GitHub.formatIssue));
    }

    return issues;
  }

  static formatIssue (issue) {
    return {
      repo: issue.repository.full_name,
      number: issue.number,
      url: issue.url,
      name: issue.title,
      description: issue.body,
      open: issue.state === 'open',

      milestone: issue.milestone ? issue.milestone.title : null,
      due: issue.milestone && new Date(issue.milestone.due_on) > 0 ? new Date(issue.milestone.due_on) : null,
      closed: issue.state === 'closed' ? new Date(issue.closed_at) : null
    }
  }

}

module.exports = GitHub;
