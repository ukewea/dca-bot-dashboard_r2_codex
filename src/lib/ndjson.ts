export function parseNdjson(text: string): unknown[] {
  const lines = text.split(/\r?\n/);
  const out: unknown[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      out.push(JSON.parse(trimmed));
    } catch {
      // tolerate malformed trailing/partial line
      continue;
    }
  }
  return out;
}

