module.exports = class GroqProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'groq placeholder', input, ctx }
  }
}
