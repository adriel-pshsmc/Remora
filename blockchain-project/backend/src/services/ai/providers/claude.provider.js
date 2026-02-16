module.exports = class ClaudeProvider {
  constructor (opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    // placeholder implementation: replace with a real client call
    return { summary: 'claude placeholder', input, ctx }
  }
}
