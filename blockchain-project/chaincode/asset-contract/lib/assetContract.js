'use strict'

// Minimal Hyperledger Fabric chaincode placeholder for an Asset contract.
// This is a stub and not functional end-to-end; it's intended as a starting point.
class AssetContract {
  async initLedger(ctx) {
    // populate ledger with initial data if required
    console.log('initLedger called')
  }

  async createAsset(ctx, id, assetJson) {
    const asset = JSON.parse(assetJson)
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)))
    return asset
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
