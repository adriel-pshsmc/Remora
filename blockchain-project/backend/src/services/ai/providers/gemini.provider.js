module.exports = class GeminiProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'gemini placeholder', input, ctx }
  }
}
