'use strict'

// Domain-level representation and validation for Asset objects.
// This file contains pure domain logic and does not interact with the ledger.

function validateAssetObject(asset) {
  if (!asset) return { valid: false, reason: 'asset_missing' }
  if (typeof asset !== 'object') return { valid: false, reason: 'asset_must_be_object' }
  if (!asset.id) return { valid: false, reason: 'missing_id' }
  if (!asset.type) return { valid: false, reason: 'missing_type' }
  if (!asset.owner) return { valid: false, reason: 'missing_owner' }
  return { valid: true }
}

function createAsset({ id, type, owner, metadata = {} }) {
  return {
    id,
    type,
    owner,
    metadata,
    createdAt: new Date().toISOString()
  }
}

module.exports = { validateAssetObject, createAsset }
