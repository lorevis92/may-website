import "server-only";

/**
 * Small in-memory token bucket per IP. Good enough to stop casual abuse of the
 * lead and chat endpoints on a single instance; for multi-instance deployments
 * add an edge rate limiter in front (e.g. Vercel Firewall) — this still helps.
 */
const buckets = new Map<string, { tokens: number; updated: number }>();

export function rateLimit(key: string, opts: { capacity: number; refillPerSec: number }): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: opts.capacity, updated: now };
  const elapsed = (now - b.updated) / 1000;
  b.tokens = Math.min(opts.capacity, b.tokens + elapsed * opts.refillPerSec);
  b.updated = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  if (buckets.size > 5000) {
    // drop the oldest entries
    for (const [k, v] of buckets) {
      if (now - v.updated > 600_000) buckets.delete(k);
    }
  }
  return true;
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}
