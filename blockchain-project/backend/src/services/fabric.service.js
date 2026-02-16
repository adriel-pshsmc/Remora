/*
  Fabric service (backend side) - Gateway wrapper

  Responsibilities:
  - Connect to a Fabric gateway using a filesystem wallet and connection profile
  - Provide helpers to evaluate and submit transactions to the network
  - Keep higher-level application code free from gateway/wallet details

  Configuration (environment variables):
    FABRIC_CONNECTION_PROFILE  - path to connection profile JSON
    FABRIC_WALLET_PATH         - path to filesystem wallet directory
    FABRIC_USER                - identity label to use from the wallet
    FABRIC_CHANNEL             - channel name
    FABRIC_CHAINCODE_NAME      - default chaincode name

  Note: this file uses the fabric-network SDK (Node.js) at runtime.
*/

const fs = require('fs')
const path = require('path')
const { Gateway, Wallets } = require('fabric-network')

const connectionProfilePath = process.env.FABRIC_CONNECTION_PROFILE || path.resolve(__dirname, '../../../fabric-network/connection-profile.json')
const walletPath = process.env.FABRIC_WALLET_PATH || path.resolve(__dirname, '../../wallet')
const userId = process.env.FABRIC_USER || 'appUser'
const channelName = process.env.FABRIC_CHANNEL || 'mychannel'
const chaincodeName = process.env.FABRIC_CHAINCODE_NAME || 'asset-contract'

let gateway

async function loadCCP() {
  if (!fs.existsSync(connectionProfilePath)) throw new Error('connection profile not found: ' + connectionProfilePath)
  const content = fs.readFileSync(connectionProfilePath)
  return JSON.parse(content.toString())
}

async function getWallet() {
  const wallet = await Wallets.newFileSystemWallet(walletPath)
  return wallet
}

async function initGateway() {
  if (gateway) return gateway
  const ccp = await loadCCP()
  const wallet = await getWallet()

  const gw = new Gateway()
  await gw.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true }
  })
  gateway = gw
  return gateway
}

async function getNetwork() {
  const gw = await initGateway()
  const network = await gw.getNetwork(channelName)
  return network
}

async function submitTransaction(fnName, ...args) {
  const network = await getNetwork()
  const contract = network.getContract(chaincodeName)
  const res = await contract.submitTransaction(fnName, ...args)
  return res && res.length ? res.toString() : ''
}

async function evaluateTransaction(fnName, ...args) {
  const network = await getNetwork()
  const contract = network.getContract(chaincodeName)
  const res = await contract.evaluateTransaction(fnName, ...args)
  return res && res.length ? res.toString() : ''
}

async function disconnect() {
  if (gateway) {
    try { gateway.disconnect() } catch (e) { /* ignore */ }
    gateway = null
  }
}

module.exports = {
  initGateway,
  getNetwork,
  submitTransaction,
  evaluateTransaction,
  disconnect
}

