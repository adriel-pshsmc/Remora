const express = require('express')
const router = express.Router()
const db = require('../services/db.service')
const requireFields = require('../middleware/validate.middleware')

// GET /assets - list all
router.get('/', async (req, res, next) => {
  try {
    const assets = await db.listAssets()
    res.json({ assets })
  } catch (err) { next(err) }
})

// POST /assets - create a new asset
router.post('/', requireFields(['id', 'type', 'owner']), async (req, res, next) => {
  try {
    const { id, type, owner, metadata } = req.body
    const existing = await db.getAsset(id)
    if (existing) return res.status(409).json({ error: 'asset_exists' })
    const asset = { id, type, owner, metadata: metadata || {}, createdAt: new Date().toISOString() }
    await db.createAsset(asset)
    res.status(201).json({ asset })
  } catch (err) { next(err) }
})

module.exports = router
