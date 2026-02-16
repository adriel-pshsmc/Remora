module.exports = class GithubProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'github placeholder', input, ctx }
  }
}
