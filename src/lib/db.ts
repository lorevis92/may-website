import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Pool, PoolClient } from "pg";

/**
 * Storage for everything May edits (leads, assistant notes, documents, guides, diary):
 *  - Postgres when DATABASE_URL is set (Vercel Postgres / Neon / Supabase / any pg).
 *  - JSON files under ./data otherwise — fine for local dev and a single self-hosted server.
 *
 * Tables are created on first use, so there is no migration step.
 */
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source TEXT NOT NULL,
    locale TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    line TEXT,
    message TEXT,
    payload JSONB,
    consent BOOLEAN NOT NULL DEFAULT false,
    page TEXT,
    user_agent TEXT
  );
  CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS ref TEXT;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS channel TEXT;
  CREATE INDEX IF NOT EXISTS leads_ref_idx ON leads (ref);

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    filename TEXT,
    content TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    truncated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS guides (
    slug TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS diary_entries (
    slug TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

/** Advisory lock keys (any fixed numbers): one-at-a-time setup across `next build` workers and server instances. */
export const SCHEMA_LOCK = 7031985;
export const SEED_LOCK = 7031986;

/**
 * Runs `fn` in a transaction that first takes the given transaction-level advisory lock, so the same
 * setup running in several processes at once happens one after the other instead of deadlocking.
 */
export async function withAdvisoryLock<T>(pool: Pool, key: number, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [key]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/** The shared Postgres pool with the schema in place, or null when running on JSON files. */
export async function db(): Promise<Pool | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const g = globalThis as unknown as { __mayPool?: Pool; __maySchema?: Promise<unknown> };
  if (!g.__mayPool) {
    const { Pool } = await import("pg");
    g.__mayPool = new Pool({ connectionString: url, ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false }, max: 3 });
  }
  // Without the lock, parallel build workers deadlock here: CREATE INDEX takes a share lock on `leads`
  // that the following ALTER TABLE then has to upgrade, and two processes wait on each other.
  g.__maySchema ??= withAdvisoryLock(g.__mayPool, SCHEMA_LOCK, (client) => client.query(SCHEMA));
  try {
    await g.__maySchema;
  } catch (err) {
    g.__maySchema = undefined; // retry on the next call
    throw err;
  }
  return g.__mayPool;
}

export const DATA_DIR = path.join(process.cwd(), "data");

/** Reads ./data/<name>; undefined when the file doesn't exist yet. */
export async function readJsonFile<T>(name: string): Promise<T | undefined> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw err;
  }
}

/** Writes ./data/<name> atomically (temp file + rename). */
export async function writeJsonFile(name: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}
