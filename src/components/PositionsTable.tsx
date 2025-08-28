import type { PositionsCurrentFile } from "../types";

type Props = { data: PositionsCurrentFile | null; selectedSymbols?: string[]; onRetry?: () => void };

export function PositionsTable({ data, selectedSymbols = [], onRetry }: Props) {
  if (!data) return (
    <div className="card" role="region" aria-label="Positions">
      <div className="card-title">Positions</div>
      <div className="empty">Could not load positions_current.json.</div>
      {onRetry && <button className="btn" onClick={onRetry}>Retry</button>}
    </div>
  );
  const rows = (selectedSymbols.length
    ? data.positions.filter((p) => selectedSymbols.includes(p.symbol))
    : data.positions);
  if (rows.length === 0) {
    return (
      <div className="card" role="region" aria-label="Positions">
        <div className="card-title">Positions</div>
        <div className="empty">No positions match current filters.</div>
        {onRetry && <button className="btn" onClick={onRetry}>Reload Data</button>}
      </div>
    );
  }
  return (
    <div className="card" role="region" aria-label="Positions table">
      <div className="card-title">Positions</div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Open Qty</th>
              <th>Avg Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const qty = p.open_quantity ?? p.open_qty ?? "0";
              return (
                <tr key={p.symbol}>
                  <td>{p.symbol}</td>
                  <td>{Number(qty).toLocaleString()}</td>
                  <td>{p.avg_cost ? Number(p.avg_cost).toLocaleString() : "—"}</td>
                  <td>{Number(p.total_cost).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
