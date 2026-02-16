const express = require('express')
const app = express()

// import routes and middleware
const aiRoutes = require('./routes/ai.routes')
const assetRoutes = require('./routes/asset.routes')
const authRoutes = require('./routes/auth.routes')
const auth = require('./middleware/auth.middleware')

app.use(express.json())

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// API mount points
app.use('/api/ai', aiRoutes)
app.use('/api/auth', authRoutes)

// protect asset endpoints with simple auth middleware
app.use('/api/assets', auth, assetRoutes)

// basic error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'internal_error' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Backend server listening on port', port)
})

module.exports = app
