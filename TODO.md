# Crypto DCA Bot — Website TODO

Source: Design document (Design_Document_Website.md). This list tracks P0 (static SPA) first, then optional P1 (API-backed) work. Items checked are already implemented in this repo.

## P0 — Static-Only SPA

- [x] Scaffold Vite + React + TypeScript app
  - Files: `index.html`, `src/`, `vite.config.ts`, `tsconfig.json`, `package.json`
- [x] Runtime config for data base path
  - `public/app-config.json` with `{ "dataBasePath": "/data" }`
  - `src/lib/config.ts` reads runtime config; supports `VITE_DATA_BASE_PATH`
- [x] File readers (read-only)
  - `positions_current.json` via `fetchPositionsCurrent()`
  - `snapshots.ndjson` via `fetchSnapshots()` with resilient NDJSON parser
- [x] Basic Dashboard page
  - Totals (invested, market value, P/L) from latest snapshot
  - Positions table from `positions_current.json`
  - Minimal SVG chart: Invested vs Market Value
- [x] Dark theme + responsive base styles (CSS only)
- [x] Fix: P/L color binding in Dashboard totals (className expression needs correction)
- [x] Symbol filter (multi-select) for table and charts
- [x] Time range selector (24h / 7d / 30d / all) for charts
- [x] Per-symbol chart toggle/filter
- [x] Last updated indicator sourced from latest snapshot (and/or positions file)
- [x] Auto-refresh/polling with backoff (e.g., 15–60s) and safe abort on unmount
- [x] Empty states for missing files (friendly messages; retry CTA)
- [x] Accessibility: keyboard nav, focus states, roles/labels on charts, high contrast
- [x] i18n scaffolding (en-US default); locale-aware number/date formatting utilities
- [x] Performance: lazy-load charts (defer snapshot fetch until chart visible)
- [x] Performance: downsample dense series (~1k points; bucket-by-time)
- [x] Performance: consider streaming NDJSON parsing where supported
- [x] Types/selectors for derived data (centralize formatting/units)
- [x] Documentation: quickstart, config, data contracts
- [x] Documentation: deployment steps (README + Actions)

## Optional Drilldowns (P0 Nice-to-have)

- [ ] Transactions view (table, filters) reading `transactions.ndjson`
- [ ] Price history table (per asset) reading `prices.ndjson`
- [ ] Link from positions table rows to per-asset drilldowns

## Ops Page (Optional)

- [ ] Iterations timeline reading `iterations.ndjson` (status, buys, notes)

## Testing Strategy

- [x] Unit tests: NDJSON parser resiliency
- [ ] Component tests: table rendering, KPI totals, chart presence
- [ ] E2E: Load app with fixtures in `public/data`, basic flows (filters, ranges)
- [ ] Performance test: parse large NDJSON fixture within bounds
- [x] CI: setup GitHub Actions to run tests and build

## Build & Deployment

- [x] Vite build config hardening (base path if deploying under subpath)
- [x] Deploy to GitHub Pages (target: `ukewea.github.io/dca-bot-dashboard_r2_codex`)
  - Added GitHub Actions workflow (`.github/workflows/deploy.yml`) using Pages
  - Vite `base` driven by `BASE_PATH`; data path via `VITE_DATA_BASE_PATH`
- [x] Container image (NGINX) to serve static files
  - Mount `/data` read-only alongside app when co-hosted with the bot
- [x] Cache headers and ETag revalidation (if behind a server)

## Resilience & Edge Cases

- [x] Tolerate atomic writes (already safe for JSON; NDJSON ignores trailing partial lines)
- [x] Gracefully handle unknown fields or missing optional fields (versioning)
- [x] Timezone handling: store in UTC; display in local TZ with toggle

## Security

- [x] Read-only website; verify no secrets or write paths
- [x] Optional basic auth via reverse-proxy (doc snippet)

## Definition of Done (P0)

- [x] Dashboard loads with `positions_current.json` and `snapshots.ndjson` from same origin
- [ ] KPIs, positions table, and charts render in <500ms typical LAN after network
- [x] Robust parsing (tolerates missing optional fields and partial NDJSON line)
- [x] Basic filters and time-range implemented
- [ ] Tests passing in CI; deployable artifact built by Actions
- [x] Short docs for config, hosting, and data directory layout
