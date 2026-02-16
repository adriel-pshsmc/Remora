// Very small in-memory rate limiter for development only.
// Not suitable for production (no clustering support).
const limits = new Map()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 120

module.exports = (req, res, next) => {
  try {
    const key = req.ip || req.connection.remoteAddress || 'anon'
    const now = Date.now()
    let entry = limits.get(key)
    if (!entry || now - entry.start > WINDOW_MS) {
      entry = { start: now, count: 1 }
      limits.set(key, entry)
      return next()
    }
    entry.count += 1
    if (entry.count > MAX_REQUESTS) {
      res.status(429).json({ error: 'rate_limit_exceeded' })
    } else next()
  } catch (e) { next(e) }
}
