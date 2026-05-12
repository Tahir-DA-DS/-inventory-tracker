# Inventory Tracker

Full-stack inventory + sales tracker built with React, Node.js, and PostgreSQL.

## Prerequisites
- Node.js v22+
- Docker + Docker Compose

## Setup

### 1. Clone and install
git clone https://github.com/YOUR_USERNAME/inventory-tracker.git
cd inventory-tracker
npm install

### 2. Environment variables
cp .env.example server/.env
# Edit server/.env with your values

### 3. Start the database
docker compose up -d

### 4. Run migrations (once backend is set up)
npm run migrate --workspace=server

### 5. Start dev servers
npm run dev:server   # backend → http://localhost:3000
npm run dev:client   # frontend → http://localhost:5173

## Project Structure
client/   → React + Vite frontend
server/   → Node.js + Express backend