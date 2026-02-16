// Validation middleware factory. Call with an array of required body fields.
// Example: app.post('/', requireFields(['name','id']), handler)
module.exports = function requireFields(fields = []) {
  return function (req, res, next) {
    if (!Array.isArray(fields) || fields.length === 0) return next()
    const missing = []
    for (const f of fields) {
      if (req.body[f] === undefined || req.body[f] === null || req.body[f] === '') {
        missing.push(f)
      }
    }
    if (missing.length) {
      return res.status(400).json({ error: 'missing_fields', fields: missing })
    }
    next()
  }
}
