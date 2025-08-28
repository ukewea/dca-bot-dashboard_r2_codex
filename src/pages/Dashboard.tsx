import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPositionsCurrent, fetchSnapshots } from "../lib/api";
import type { PositionsCurrentFile, SnapshotLine } from "../types";
import { Kpis } from "../components/Kpis";
import { PositionsTable } from "../components/PositionsTable";
import { TimeSeriesChart } from "../components/TimeSeriesChart";
import { SymbolFilter } from "../components/SymbolFilter";
import { formatDate } from "../lib/format";
import { t } from "../lib/i18n";

export default function Dashboard() {
  const [positions, setPositions] = useState<PositionsCurrentFile | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "all">("all");
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [tz, setTz] = useState<"local" | "utc">("local");
  const chartSentinel = useRef<HTMLDivElement | null>(null);
  const [snapshotsLoaded, setSnapshotsLoaded] = useState(false);

  const reload = async () => {
    const ctl = new AbortController();
    try {
      const [p, s] = await Promise.all([
        fetchPositionsCurrent(ctl.signal),
        fetchSnapshots(ctl.signal),
      ]);
      setPositions(p);
      setSnapshots(s);
      setSnapshotsLoaded(true);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      try {
        const p = await fetchPositionsCurrent(ctl.signal);
        setPositions(p);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
    return () => ctl.abort();
  }, []);

  // Simple auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const ctl = new AbortController();
        const p = await fetchPositionsCurrent(ctl.signal);
        setPositions(p);
        if (snapshotsLoaded) {
          const s = await fetchSnapshots(ctl.signal);
          setSnapshots(s);
        }
      } catch {
        /* ignore */
      }
    }, 30000);
    return () => clearInterval(id);
  }, [snapshotsLoaded]);

  useEffect(() => {
    if (snapshotsLoaded) return;
    const node = chartSentinel.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (async () => {
            try {
              const s = await fetchSnapshots();
              setSnapshots(s);
              setSnapshotsLoaded(true);
            } catch {}
          })();
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: '120px' });
    io.observe(node);
    return () => io.disconnect();
  }, [chartSentinel, snapshotsLoaded]);

  const latest = useMemo(() => snapshots.at(-1), [snapshots]);
  const mv = latest ? Number(latest.total_market_value) : null;
  const invested = latest ? Number(latest.total_quote_invested) : null;
  const pl = latest ? Number(latest.total_unrealized_pl) : null;
  const base = latest?.base_currency ?? positions?.base_currency ?? "";

  const filteredSnapshots = useMemo(() => {
    if (range === "all" || snapshots.length === 0) return snapshots;
    const end = new Date(snapshots.at(-1)!.ts).getTime();
    const day = 24 * 60 * 60 * 1000;
    const windowMs = range === "24h" ? day : range === "7d" ? 7 * day : 30 * day;
    const start = end - windowMs;
    return snapshots.filter((s) => new Date(s.ts).getTime() >= start);
  }, [snapshots, range]);

  const symbols = useMemo(() => {
    const set = new Set<string>();
    const src = latest?.positions ?? positions?.positions ?? [];
    for (const p of src) set.add(p.symbol);
    return Array.from(set).sort();
  }, [latest, positions]);

  return (
    <main>
      <header className="topbar">
        <h1>Crypto DCA Bot — Dashboard</h1>
        <div className="spacer" />
        <a className="link" href={`${import.meta.env.BASE_URL}app-config.json`} target="_blank" rel="noreferrer">config</a>
      </header>
      {error && <div className="error">{error}</div>}
      <section className="grid" role="region" aria-label="Portfolio totals and controls">
        <div className="card">
          <div className="card-title">{t('totals')}</div>
          <div className="totals">
            <div>
              <div className="label">{t('invested')}</div>
              <div className="big">{invested != null ? invested.toLocaleString() : "—"} {base}</div>
            </div>
            <div>
              <div className="label">{t('market_value')}</div>
              <div className="big">{mv != null ? mv.toLocaleString() : "—"} {base}</div>
            </div>
            <div>
              <div className="label">{t('unrealized_pl')}</div>
              <div className={`big ${pl == null ? "" : pl < 0 ? "neg" : "pos"}`}>
                {pl != null ? pl.toLocaleString() : "—"} {base}
              </div>
            </div>
          </div>
          <div className="meta">
            <span className="label">{t('last_snapshot')}:</span>
            <span> {latest ? formatDate(latest.ts, tz) : "—"}</span>
            <span className="label" style={{ marginLeft: 12 }}>{t('positions_updated')}:</span>
            <span> {positions ? formatDate(positions.updated_at, tz) : "—"}</span>
            <span className="label" style={{ marginLeft: 12 }}>TZ:</span>
            <button className="btn" onClick={() => setTz(tz === 'local' ? 'utc' : 'local')}>{tz.toUpperCase()}</button>
          </div>
          <div className="controls" role="group" aria-label="Time range selector">
            <button className={range === "24h" ? "btn active" : "btn"} onClick={() => setRange("24h")}>24h</button>
            <button className={range === "7d" ? "btn active" : "btn"} onClick={() => setRange("7d")}>7d</button>
            <button className={range === "30d" ? "btn active" : "btn"} onClick={() => setRange("30d")}>30d</button>
            <button className={range === "all" ? "btn active" : "btn"} onClick={() => setRange("all")}>All</button>
            </div>
        </div>
        <Kpis data={positions} />
      </section>
      <SymbolFilter symbols={symbols} selected={selectedSymbols} onChange={setSelectedSymbols} />
      <div ref={chartSentinel} />
      <TimeSeriesChart snapshots={filteredSnapshots} selectedSymbols={selectedSymbols} onRetry={reload} />
      <PositionsTable data={positions} selectedSymbols={selectedSymbols} onRetry={reload} />
      <footer className="footer">Data updates from files in /data</footer>
    </main>
  );
}
