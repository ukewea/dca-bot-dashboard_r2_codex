import { getConfig } from "./config";
import { parseNdjson } from "./ndjson";
import type { PositionsCurrentFile, SnapshotLine } from "../types";

async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

async function safeText(res: Response): Promise<string> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return await res.text();
}

export async function fetchPositionsCurrent(signal?: AbortSignal): Promise<PositionsCurrentFile | null> {
  const base = getConfig().dataBasePath.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/positions_current.json`, { signal });
    return await safeJson<PositionsCurrentFile>(res);
  } catch {
    return null;
  }
}

async function fetchNdjsonStream(url: string, signal?: AbortSignal): Promise<unknown[]> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  if (!res.body) {
    const text = await res.text();
    return parseNdjson(text);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  const out: unknown[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      try { out.push(JSON.parse(line)); } catch { /* tolerate */ }
    }
  }
  if (buf.trim()) {
    try { out.push(JSON.parse(buf.trim())); } catch { /* tolerate partial */ }
  }
  return out;
}

export async function fetchSnapshots(signal?: AbortSignal): Promise<SnapshotLine[]> {
  const base = getConfig().dataBasePath.replace(/\/$/, "");
  try {
    const url = `${base}/snapshots.ndjson`;
    const parsed = (await fetchNdjsonStream(url, signal)) as SnapshotLine[];
    return parsed;
  } catch {
    return [];
  }
}
