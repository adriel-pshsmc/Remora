// Simple bearer-token auth middleware for development
// Accepts any non-empty Bearer token and attaches a dev user to req.user.
// In production replace with real JWT/session validation.
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    if (token && token.trim().length > 0) {
      // Attach a lightweight user object for downstream handlers
      req.user = { id: token, role: 'developer' }
      return next()
    }
  }

  // Allow safe GET requests without auth for development convenience
  if (req.method === 'GET') return next()

  return res.status(401).json({ error: 'Unauthorized' })
}
