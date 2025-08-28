export type Timezone = 'local' | 'utc';

export function formatNumber(n: number | null | undefined, locale?: string) {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toLocaleString(locale);
}

export function formatDate(value: string | number | Date | null | undefined, tz: Timezone, locale?: string) {
  if (!value) return '—';
  const d = new Date(value);
  const opts: Intl.DateTimeFormatOptions = tz === 'utc' ? { timeZone: 'UTC' } : {};
  return d.toLocaleString(locale, opts);
}

