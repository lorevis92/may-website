import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Pool } from "pg";

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

/** The shared Postgres pool with the schema in place, or null when running on JSON files. */
export async function db(): Promise<Pool | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const g = globalThis as unknown as { __mayPool?: Pool; __maySchema?: Promise<unknown> };
  if (!g.__mayPool) {
    const { Pool } = await import("pg");
    g.__mayPool = new Pool({ connectionString: url, ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false }, max: 3 });
  }
  g.__maySchema ??= g.__mayPool.query(SCHEMA);
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
