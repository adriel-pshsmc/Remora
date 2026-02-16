module.exports = class CodestralProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'codestral placeholder', input, ctx }
  }
}
