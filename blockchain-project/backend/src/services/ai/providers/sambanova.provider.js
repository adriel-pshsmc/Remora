module.exports = class SambanovaProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'sambanova placeholder', input, ctx }
  }
}
