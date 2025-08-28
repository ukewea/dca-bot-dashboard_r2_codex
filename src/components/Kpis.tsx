import { useMemo } from "react";
import type { PositionsCurrentFile } from "../types";

type Props = { data: PositionsCurrentFile | null };

export function Kpis({ data }: Props) {
  const values = useMemo(() => {
    if (!data) return null;
    const invested = Number(data.total_quote_invested);
    return { invested, base: data.base_currency, updatedAt: data.updated_at };
  }, [data]);

  if (!values) return (
    <section className="kpis">
      <div className="kpi"><span className="label">Invested</span><span className="value">—</span></div>
      <div className="kpi"><span className="label">Market Value</span><span className="value">—</span></div>
      <div className="kpi"><span className="label">P/L</span><span className="value">—</span></div>
    </section>
  );

  return (
    <section className="kpis">
      <div className="kpi">
        <span className="label">Invested</span>
        <span className="value">{values.invested.toLocaleString()} {values.base}</span>
      </div>
      <div className="kpi">
        <span className="label">Market Value</span>
        <span className="value">from snapshots</span>
      </div>
      <div className="kpi">
        <span className="label">P/L</span>
        <span className="value">from snapshots</span>
      </div>
      <div className="kpi">
        <span className="label">Updated</span>
        <span className="value">{new Date(values.updatedAt).toLocaleString()}</span>
      </div>
    </section>
  );
}

