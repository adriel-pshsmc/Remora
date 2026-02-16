'use strict'

const domain = require('./domain/assetDomain')

// AssetContract keeps ledger interactions (ctx.stub) but delegates
// domain rules and object construction to domain modules.
class AssetContract {
  async initLedger(ctx) {
    // Optionally populate ledger with initial data. Keep this minimal.
    console.info('initLedger called')
  }

  // createAsset expects a JSON string payload (to match many sample flows)
  async createAsset(ctx, id, assetJson) {
    const parsed = JSON.parse(assetJson)
    // ensure the domain object has the expected shape
    const assetObj = domain.createAsset({ id, type: parsed.type, owner: parsed.owner, metadata: parsed.metadata || {} })
    const validation = domain.validateAssetObject(assetObj)
    if (!validation.valid) {
      throw new Error(`invalid_asset: ${validation.reason}`)
    }

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(assetObj)))
    return assetObj
  }

  async readAsset(ctx, id) {
    const data = await ctx.stub.getState(id)
    if (!data || data.length === 0) {
      throw new Error(`Asset ${id} does not exist`)
    }
    return JSON.parse(data.toString())
  }
}

module.exports = AssetContract
