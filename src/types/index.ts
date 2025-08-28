export type PositionCurrent = {
  symbol: string;
  open_quantity?: string; // positions_current.json uses open_quantity
  open_qty?: string; // snapshots uses open_qty
  total_cost: string;
  avg_cost?: string;
  price?: string;
  market_value?: string;
  unrealized_pl?: string;
};

export type PositionsCurrentFile = {
  updated_at: string;
  base_currency: string;
  total_quote_invested: string;
  positions: PositionCurrent[];
};

export type SnapshotLine = {
  ts: string;
  base_currency: string;
  total_quote_invested: string;
  total_market_value: string;
  total_unrealized_pl: string;
  positions: PositionCurrent[];
};

export type AppConfig = {
  dataBasePath: string;
};

