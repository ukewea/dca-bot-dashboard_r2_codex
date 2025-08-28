# Crypto DCA Bot — Website (P0)

A lightweight, file-based SPA that visualizes a simulated DCA portfolio by reading JSON/NDJSON files served from the same origin.

## Overview
- Data files: `public/data/positions_current.json`, `public/data/snapshots.ndjson` (optional: `prices.ndjson`, `transactions.ndjson`).
- Tech: React + TypeScript + Vite; no server required for P0.
- Config: Runtime `public/app-config.json` or build-time `VITE_DATA_BASE_PATH`.

## Prerequisites
- Node.js 18+ and npm

## Local Development
- Install: `npm install`
- Start: `npm run dev`
- Open: the printed URL (e.g., `http://localhost:5173`)
- Data path: reads `/data/...` (served from `public/data` in dev)

## Production Build & Preview
- Build: `npm run build`
- Preview: `npm run preview` (e.g., `http://localhost:4173`)

## Configuration
- Runtime (recommended): edit `public/app-config.json`:
  - `{ "dataBasePath": "/data" }`
- Build-time (optional): set env `VITE_DATA_BASE_PATH` (e.g., `/static/data`)
- Vite base path: builds respect `BASE_PATH` env (defaults to `/`).

## Data Contracts (summary)
- `positions_current.json`: `{ updated_at, base_currency, total_quote_invested, positions: [{symbol, open_quantity, total_cost}] }`
- `snapshots.ndjson`: one JSON object per line: `{ ts, base_currency, total_quote_invested, total_market_value, total_unrealized_pl, positions: [...] }`
- Parser notes: NDJSON parser tolerates blank/malformed trailing lines and unknown fields.

## Deploy to GitHub Pages
This repo includes a workflow `.github/workflows/deploy.yml`.

Steps:
- Push to `main` (or `master`).
- In GitHub → Settings → Pages: set Source to “GitHub Actions”.
- Workflow computes base path:
  - If repo name ends with `.github.io` → `/`
  - Otherwise → `/<repo-name>/`
- Build envs:
  - `BASE_PATH` → Vite asset base
  - `VITE_DATA_BASE_PATH` → `${BASE_PATH}data` (so the SPA fetches files under the same subpath)

Result:
- User/Org site repo: `https://<user>.github.io/`
- Project repo: `https://<user>.github.io/<repo>/`

## CI (tests/build)
- `.github/workflows/ci.yml` builds on pushes/PRs and runs `npm test` if present (`--if-present`).

## Troubleshooting
- Empty UI: verify files exist under `public/data/` and are deployed alongside the app.
- 404 for `/data/...`: adjust `public/app-config.json` or build with `VITE_DATA_BASE_PATH`.
- Subpath issues: confirm Pages base path and that `BASE_PATH` was set during build (workflow handles this automatically).

