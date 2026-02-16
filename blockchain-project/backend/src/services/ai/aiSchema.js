// Minimal request validation for AI endpoints. Avoid external deps for scaffold.
module.exports = {
  validate(body = {}) {
    if (!body) return { message: 'empty_body' }
    if (typeof body.input === 'undefined' || body.input === null) return { message: 'missing_input' }
    // input may be string or object depending on provider
    if (typeof body.input !== 'string' && typeof body.input !== 'object') return { message: 'invalid_input_type' }
    return null
  }
}
