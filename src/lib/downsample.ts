export type Point = { t: number; [k: string]: number };

export function downsampleByBuckets(points: Point[], maxPoints = 1000): Point[] {
  if (points.length <= maxPoints) return points;
  const first = points[0].t;
  const last = points[points.length - 1].t;
  const span = Math.max(1, last - first);
  const bucketWidth = span / maxPoints;
  const buckets: Record<number, Point[]> = {};
  for (const p of points) {
    const idx = Math.floor((p.t - first) / bucketWidth);
    (buckets[idx] ||= []).push(p);
  }
  const out: Point[] = [];
  const keys = Object.keys(buckets).map((k) => Number(k)).sort((a, b) => a - b);
  for (const k of keys) {
    const b = buckets[k];
    // pick last point in bucket to preserve step-like evolution
    out.push(b[b.length - 1]);
  }
  return out;
}

