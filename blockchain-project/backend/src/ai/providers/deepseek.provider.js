module.exports = class DeepseekProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'deepseek placeholder', input, ctx }
  }
}
