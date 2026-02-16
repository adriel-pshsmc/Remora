module.exports = class CloudflareProvider {
  constructor(opts = {}) { this.opts = opts }
  async analyze(input, ctx = {}) {
    return { summary: 'cloudflare placeholder', input, ctx }
  }
}
