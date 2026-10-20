import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Lead storage with two backends:
 *  - Postgres when DATABASE_URL is set (Vercel Postgres / Neon / Supabase / any pg).
 *  - A JSON-lines file otherwise (./data/leads.jsonl) — fine for local dev and small self-hosted setups.
 *
 * The table is created on first use, so there is no migration step.
 */

export type LeadSource =
  | "quiz"
  | "coverage"
  | "retirement"
  | "tax"
  | "education"
  | "health-check"
  | "guide"
  | "chat"
  | "book"
  | "contact";

export interface LeadInput {
  source: LeadSource;
  locale: "th" | "en";
  name?: string;
  email?: string;
  phone?: string;
  line?: string;
  message?: string;
  /** Free-form structured payload (tool inputs & result, guide slug, chat transcript, …). */
  payload?: Record<string, unknown>;
  consent: boolean;
  /** Page the lead came from, for context. */
  page?: string;
  userAgent?: string;
}

export interface Lead extends LeadInput {
  id: string;
  createdAt: string;
}

const FILE = path.join(process.cwd(), "data", "leads.jsonl");

async function pgClient() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const { Pool } = await import("pg");
  const g = globalThis as unknown as { __mayPool?: InstanceType<typeof Pool> };
  if (!g.__mayPool) {
    g.__mayPool = new Pool({ connectionString: url, ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false }, max: 3 });
    await g.__mayPool.query(`
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
    `);
  }
  return g.__mayPool;
}

export async function saveLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = { id: randomUUID(), createdAt: new Date().toISOString(), ...input };
  const pool = await pgClient();
  if (pool) {
    await pool.query(
      `INSERT INTO leads (id, created_at, source, locale, name, email, phone, line, message, payload, consent, page, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        lead.id,
        lead.createdAt,
        lead.source,
        lead.locale,
        lead.name ?? null,
        lead.email ?? null,
        lead.phone ?? null,
        lead.line ?? null,
        lead.message ?? null,
        lead.payload ? JSON.stringify(lead.payload) : null,
        lead.consent,
        lead.page ?? null,
        lead.userAgent ?? null,
      ],
    );
    return lead;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.appendFile(FILE, JSON.stringify(lead) + "\n", "utf8");
  return lead;
}

export async function listLeads(limit = 500): Promise<Lead[]> {
  const pool = await pgClient();
  if (pool) {
    const { rows } = await pool.query(`SELECT * FROM leads ORDER BY created_at DESC LIMIT $1`, [limit]);
    return rows.map((r) => ({
      id: r.id,
      createdAt: new Date(r.created_at).toISOString(),
      source: r.source,
      locale: r.locale,
      name: r.name ?? undefined,
      email: r.email ?? undefined,
      phone: r.phone ?? undefined,
      line: r.line ?? undefined,
      message: r.message ?? undefined,
      payload: r.payload ?? undefined,
      consent: !!r.consent,
      page: r.page ?? undefined,
      userAgent: r.user_agent ?? undefined,
    }));
  }
  try {
    const text = await fs.readFile(FILE, "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .reverse()
      .slice(0, limit);
  } catch {
    return [];
  }
}
