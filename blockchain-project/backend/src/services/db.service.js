// Very small in-memory DB service for development and tests.
// Not persistent — restart clears data.
const store = {
  users: [],
  assets: []
}

module.exports = {
  // users
  async listUsers() {
    return store.users
  },
  async createUser(user) {
    store.users.push(user)
    return user
  },
  async findUserById(id) {
    return store.users.find(u => u.id === id)
  },

  // assets
  async listAssets() {
    return store.assets
  },
  async getAsset(id) {
    return store.assets.find(a => a.id === id)
  },
  async createAsset(asset) {
    store.assets.push(asset)
    return asset
  },
  async clear() {
    store.users = []
    store.assets = []
  }
}
