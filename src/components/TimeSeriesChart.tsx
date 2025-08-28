import { useMemo } from "react";
import type { SnapshotLine } from "../types";

type Props = {
  snapshots: SnapshotLine[];
  height?: number;
  selectedSymbols?: string[];
  onRetry?: () => void;
};

export function TimeSeriesChart({ snapshots, height = 220, selectedSymbols = [], onRetry }: Props) {
  const series = useMemo(() => {
    const points = snapshots.map((s) => {
      if (selectedSymbols.length === 0) {
        return {
          t: new Date(s.ts).getTime(),
          invested: Number(s.total_quote_invested),
          value: Number(s.total_market_value),
        };
      }
      const sel = new Set(selectedSymbols);
      const inv = s.positions
        .filter((p) => sel.has(p.symbol))
        .reduce((acc, p) => acc + Number(p.total_cost || 0), 0);
      const val = s.positions
        .filter((p) => sel.has(p.symbol))
        .reduce((acc, p) => acc + Number(p.market_value || 0), 0);
      return { t: new Date(s.ts).getTime(), invested: inv, value: val };
    });
    if (points.length === 0) return { points, min: 0, max: 1 };
    const min = Math.min(...points.map((p) => Math.min(p.invested, p.value)));
    const max = Math.max(...points.map((p) => Math.max(p.invested, p.value)));
    return { points, min, max };
  }, [snapshots]);

  const w = 640;
  const h = height;
  const pad = 24;
  const t0 = series.points[0]?.t ?? 0;
  const t1 = series.points.at(-1)?.t ?? 1;
  const dt = Math.max(1, t1 - t0);
  const dv = Math.max(1e-6, series.max - series.min);

  const x = (t: number) => pad + ((t - t0) / dt) * (w - 2 * pad);
  const y = (v: number) => h - pad - ((v - series.min) / dv) * (h - 2 * pad);

  const path = (key: "invested" | "value") =>
    series.points.map((p, i) => `${i ? "L" : "M"}${x(p.t)},${y(p[key])}`).join(" ");

  return (
    <div className="card">
      <div className="card-title">Portfolio — Invested vs Market Value</div>
      {series.points.length === 0 ? (
        <div className="empty">No snapshot data.</div>
      ) : (
        <svg width={w} height={h} role="img" aria-labelledby="chart-title chart-desc">
          <title id="chart-title">Portfolio timeseries</title>
          <desc id="chart-desc">Lines for invested and market value over time</desc>
          <rect x="0" y="0" width={w} height={h} fill="#0b1020" rx="8" />
          <g>
            <path d={path("invested")} fill="none" stroke="#60a5fa" strokeWidth="2" />
            <path d={path("value")} fill="none" stroke="#34d399" strokeWidth="2" />
          </g>
        </svg>
      )}
      {series.points.length === 0 && onRetry && (
        <button className="btn" onClick={onRetry}>Retry</button>
      )}
      <div className="legend">
        <span className="dot" style={{ background: "#60a5fa" }} /> Invested
        <span className="dot" style={{ background: "#34d399", marginLeft: 12 }} /> Market Value
      </div>
    </div>
  );
}
