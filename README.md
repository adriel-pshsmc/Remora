# Remora
Miro is already designed to be for the usage of organizations and most especially businesses for collaboration, team building, and more optimized work systems and strategies. But what could be a tool for these businesses to expand, enhance, and optimize the actual operations on the ground? Introducing Remora! Remora is an online-based logistics and finance operation platform aimed at increasing efficiency in the management of inventory levels, storage coordination, and supply chain operations. Developed as an online dashboard, the platform offers an organization the ability to monitor operations in real-time. Additionally, the application offers predictive analysis via the use of AI tools and increased transparency via the use of blockchain technology. Remora does not operate as an alternative to existing enterprise resource planning systems but aims to provide organizations with visibility into operations to ensure efficiency in an increasingly disrupted and chaotic business environment.

We believe that if we’re able to create Remora to its maximum capacity and efficiency, it would help Miro bolster the capabilities of the organization through the simplified yet networked application. This would allow for a unified and protected blockchain for the different utilities of the organization that is monitored and accessed by Artificial Intelligence to bolster analysis and understanding for the user. We also hope to utilize this technology not only with Miro and the private sector, but within government agencies as well, starting with the organization that the team is under: The Philippine Science High School System. We hope that this idea can be fostered by both private and public organizations to maximize convenience for the customers.

# Code

The blockchain code presently uses a past project's initial template, which is BigChainDB. It is customized to fit the needs of our logistics handling project.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python + FastAPI + SQLAlchemy + Alembic
- **Database**: PostgreSQL (SQL) + MongoDB (BigChainDB)
- **Blockchain**: BigChainDB (with Tendermint consensus)
- **DevOps**: Docker + docker-compose + GitHub Actions CI

## Setup

### Prerequisites
- Docker and docker-compose
- Node.js 18+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Quick Start with Docker
```bash
# Clone the repo
git clone <repo-url>
cd remora

# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# BigChainDB: http://localhost:9984
```

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
# Set DATABASE_URL env var
uvicorn app:app --reload
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Database Migrations
```bash
cd database
alembic upgrade head
```

## API Documentation
When running, visit http://localhost:8000/docs for FastAPI interactive docs.