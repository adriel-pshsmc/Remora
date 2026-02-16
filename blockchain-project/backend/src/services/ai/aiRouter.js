const express = require('express')
const router = express.Router()
const aiFactory = require('./aiFactory')
const aiSchema = require('./aiSchema')

// POST /predict
router.post('/predict', async (req, res, next) => {
  try {
    const body = req.body || {}
    const err = aiSchema.validate(body)
    if (err) return res.status(400).json({ error: 'invalid_request', details: err })

    const providerName = (body.provider || 'claude').toLowerCase()
    const provider = aiFactory.create(providerName)
    const result = await provider.analyze(body.input, { metadata: body.metadata || {} })
    res.json({ provider: providerName, result })
  } catch (e) { next(e) }
})

module.exports = router
