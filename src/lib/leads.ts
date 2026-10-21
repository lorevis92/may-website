import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DATA_DIR, db } from "@/lib/db";
import { newLeadRef } from "@/lib/line";

/** Lead storage: Postgres when DATABASE_URL is set, otherwise a JSON-lines file (./data/leads.jsonl). See lib/db.ts. */

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
  /** Short code quoted in the LINE message (see lib/line.ts); generated here when missing. */
  ref?: string;
  /** "line" when the visitor tapped "Talk to May on LINE" instead of sending the form. */
  channel?: "form" | "line";
}

export interface Lead extends LeadInput {
  id: string;
  ref: string;
  createdAt: string;
}

const FILE = path.join(DATA_DIR, "leads.jsonl");

export async function saveLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = { id: randomUUID(), createdAt: new Date().toISOString(), ...input, ref: input.ref ?? newLeadRef() };
  const pool = await db();
  if (pool) {
    await pool.query(
      `INSERT INTO leads (id, created_at, source, locale, name, email, phone, line, message, payload, consent, page, user_agent, ref, channel)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
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
        lead.ref,
        lead.channel ?? null,
      ],
    );
    return lead;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.appendFile(FILE, JSON.stringify(lead) + "\n", "utf8");
  return lead;
}

export async function listLeads(limit = 500): Promise<Lead[]> {
  const pool = await db();
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
      ref: r.ref ?? "",
      channel: r.channel ?? undefined,
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
