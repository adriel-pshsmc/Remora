module.exports = class OllamaProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'ollama placeholder', input, ctx }
  }
}
