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
This repo includes a workflow `.github/workflows/deploy.yml` that targets:

- URL: `https://ukewea.github.io/dca-bot-dashboard_r2_codex/`
- Base path: `/dca-bot-dashboard_r2_codex/`

Steps:
- Push to `main` (or `master`).
- In GitHub → Settings → Pages: set Source to “GitHub Actions”.
- The workflow builds with:
  - `BASE_PATH=/dca-bot-dashboard_r2_codex/` (Vite asset base)
  - `VITE_DATA_BASE_PATH=/dca-bot-dashboard_r2_codex/data` (SPA fetch path)
- It also copies `dist/index.html` to `dist/404.html` for SPA deep-link fallback on Pages.

Result:
- Site: `https://ukewea.github.io/dca-bot-dashboard_r2_codex/`

## CI (tests/build)
- `.github/workflows/ci.yml` builds on pushes/PRs and runs `npm test` if present (`--if-present`).

## Container (optional)
- Build app: `npm run build`
- Build image: `docker build -t dca-bot-dashboard .`
- Run: `docker run -p 8080:80 -v $(pwd)/public/data:/usr/share/nginx/html/data:ro dca-bot-dashboard`
- Open: `http://localhost:8080/dca-bot-dashboard_r2_codex/` if served behind a subpath proxy, or `/` if served at root.

Notes:
- `nginx.conf` includes SPA fallback and serves `/data` with no-cache headers.
- For reverse-proxies, ensure the subpath matches `BASE_PATH` used during build.

## Troubleshooting
- Empty UI: verify files exist under `public/data/` and are deployed alongside the app.
- 404 for `/data/...`: adjust `public/app-config.json` or build with `VITE_DATA_BASE_PATH`.
- Subpath issues: confirm Pages base path and that `BASE_PATH` was set during build (workflow handles this automatically).
- Consider adding cache/ETag headers on your server for static assets; `/data` is served `no-cache` by the provided NGINX config to avoid stale reads during active trading.
