// Simple AI provider factory
const providers = {
  claude: require('./providers/claude.provider'),
  gemini: require('./providers/gemini.provider'),
  groq: require('./providers/groq.provider'),
  deepseek: require('./providers/deepseek.provider'),
  codestral: require('./providers/codestral.provider'),
  sambanova: require('./providers/sambanova.provider'),
  cloudflare: require('./providers/cloudflare.provider'),
  github: require('./providers/github.provider'),
  ollama: require('./providers/ollama.provider')
}

module.exports = {
  create(name = 'claude') {
    const key = String(name || 'claude').toLowerCase()
    const ProviderCtor = providers[key] || providers['claude']
    return new ProviderCtor()
  }
}
