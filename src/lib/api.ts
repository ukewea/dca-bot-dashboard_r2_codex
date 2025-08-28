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

export async function fetchSnapshots(signal?: AbortSignal): Promise<SnapshotLine[]> {
  const base = getConfig().dataBasePath.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/snapshots.ndjson`, { signal });
    const text = await safeText(res);
    const parsed = parseNdjson(text) as SnapshotLine[];
    return parsed;
  } catch {
    return [];
  }
}

