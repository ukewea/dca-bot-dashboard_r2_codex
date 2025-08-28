type Dict = Record<string, string>;

const en: Dict = {
  totals: 'Totals',
  invested: 'Invested',
  market_value: 'Market Value',
  unrealized_pl: 'Unrealized P/L',
  last_snapshot: 'Last snapshot',
  positions_updated: 'Positions updated',
  time_range: 'Time range',
  symbols: 'Symbols',
  positions: 'Positions',
  no_snapshot_data: 'No snapshot data.',
  reload_data: 'Reload Data',
  retry: 'Retry',
};

const catalogs: Record<string, Dict> = { en };

let current = 'en';

export function setLocale(locale: string) {
  current = catalogs[locale] ? locale : 'en';
}

export function t(key: keyof typeof en): string {
  const dict = catalogs[current] || en;
  return dict[key] || key;
}

