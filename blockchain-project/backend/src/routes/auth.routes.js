const express = require('express')
const router = express.Router()

// POST /auth/login
router.post('/login', async (req, res) => {
  res.json({ token: 'fake-jwt-token' })
})

module.exports = router
