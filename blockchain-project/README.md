# my-enterprise-project

This repository is a scaffold for an enterprise application that combines a frontend UI, an Express backend, a Hyperledger Fabric network, and chaincode for assets.

Structure
- frontend/: UI application (Vite/React recommended)
- backend/: Express API server (routes, services, middleware)
- fabric-network/: Fabric network configuration and connection profiles
- chaincode/: chaincode packages (e.g. asset-contract)
- scripts/: helper scripts for starting Fabric and deploying chaincode

Quick start (backend)

1. cd backend
2. npm install
3. npm run dev

The backend listens on PORT (default 3000). The asset endpoints are available under `/api/assets` and are protected by a simple development auth middleware (accepts any Bearer token).

Notes
- This scaffold contains placeholders. Replace the Fabric docker-compose and the chaincode with real implementations for production.
