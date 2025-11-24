# MemeScout Scaffold

This zip contains:
- backend/ (Node + TypeScript + Express + workers)
- frontend/ (Next.js app)
- Dockerfile + docker-compose.yml
- PostgreSQL schema and migration runner

Quick start (dev with Docker):

1. docker-compose up --build
2. Backend at http://localhost:4000
3. Frontend at http://localhost:3000

Backend scripts:
- npm run migrate  # run SQL migrations
- npm run dev      # dev server
- npm run worker:newtokens
- npm run worker:pumpfun
- npm run worker:metrics
- npm run worker:alerts
