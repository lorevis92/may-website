import "server-only";
import { cache } from "react";
import type { Pool } from "pg";
import { diary as seedDiary, guides as seedGuides } from "@/content";
import type { DiaryEntry, Guide } from "@/content/types";
import { db, readJsonFile, SEED_LOCK, withAdvisoryLock, writeJsonFile } from "@/lib/db";
import { blocksToMarkdown, markdownToBlocks } from "@/lib/markdown";

/**
 * Guides and diary entries, edited by May in /admin and stored in the database (lib/db.ts).
 * Bodies are kept as the small Markdown dialect from lib/markdown.ts and turned into blocks for the pages.
 * On first use the original content from src/content is copied in, once, so nothing is lost.
 */

export interface GuideLocaleDoc {
  title: string;
  subtitle: string;
  readingMinutes: number;
  summary: string[];
  body: string;
}
export interface GuideDoc extends Omit<Guide, "th" | "en"> {
  th: GuideLocaleDoc;
  en: GuideLocaleDoc;
}

export interface DiaryLocaleDoc {
  title: string;
  excerpt: string;
  body: string;
}
export interface DiaryDoc extends Omit<DiaryEntry, "th" | "en"> {
  th: DiaryLocaleDoc;
  en: DiaryLocaleDoc;
}

type Kind = "guides" | "diary";
type DocOf<K extends Kind> = K extends "guides" ? GuideDoc : DiaryDoc;
const TABLE: Record<Kind, string> = { guides: "guides", diary: "diary_entries" };
const FILE: Record<Kind, string> = { guides: "guides.json", diary: "diary.json" };

function seedDocs<K extends Kind>(kind: K): DocOf<K>[] {
  if (kind === "guides") {
    return seedGuides.map(({ th, en, ...meta }) => ({
      ...meta,
      th: { title: th.title, subtitle: th.subtitle, readingMinutes: th.readingMinutes, summary: th.summary, body: blocksToMarkdown(th.blocks) },
      en: { title: en.title, subtitle: en.subtitle, readingMinutes: en.readingMinutes, summary: en.summary, body: blocksToMarkdown(en.blocks) },
    })) as DocOf<K>[];
  }
  return seedDiary.map(({ th, en, ...meta }) => ({
    ...meta,
    th: { title: th.title, excerpt: th.excerpt, body: blocksToMarkdown(th.blocks) },
    en: { title: en.title, excerpt: en.excerpt, body: blocksToMarkdown(en.blocks) },
  })) as DocOf<K>[];
}

/**
 * Copies the original content into Postgres exactly once (a "seeded:<kind>" flag survives May deleting everything).
 * Guides and diary use the same advisory lock, so parallel build workers seed one at a time, and each process
 * keeps the in-flight promise so concurrent requests in it wait for one run instead of starting their own.
 */
function seedOnce(pool: Pool, kind: Kind): Promise<void> {
  const g = globalThis as unknown as { __maySeeding?: Map<Kind, Promise<void>> };
  g.__maySeeding ??= new Map();
  let run = g.__maySeeding.get(kind);
  if (!run) {
    run = seed(pool, kind).catch((err) => {
      g.__maySeeding?.delete(kind); // retry on the next call
      throw err;
    });
    g.__maySeeding.set(kind, run);
  }
  return run;
}

async function seed(pool: Pool, kind: Kind): Promise<void> {
  const key = `seeded:${kind}`;
  // Fast path once it's done: no transaction, no lock.
  const done = await pool.query("SELECT 1 FROM settings WHERE key = $1", [key]);
  if (done.rowCount) return;
  await withAdvisoryLock(pool, SEED_LOCK, async (client) => {
    const flag = await client.query("INSERT INTO settings (key, value) VALUES ($1, 'yes') ON CONFLICT (key) DO NOTHING", [key]);
    if (flag.rowCount !== 1) return; // another process finished it while we waited for the lock
    for (const doc of seedDocs(kind)) {
      await client.query(`INSERT INTO ${TABLE[kind]} (slug, data) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`, [doc.slug, JSON.stringify(doc)]);
    }
  });
}

async function loadAll<K extends Kind>(kind: K): Promise<DocOf<K>[]> {
  const pool = await db();
  if (pool) {
    await seedOnce(pool, kind);
    const { rows } = await pool.query(`SELECT data FROM ${TABLE[kind]}`);
    return rows.map((r) => r.data as DocOf<K>);
  }
  const stored = await readJsonFile<DocOf<K>[]>(FILE[kind]);
  if (stored) return stored;
  const seeded = seedDocs(kind);
  // Best effort: a read-only filesystem (e.g. a serverless build without DATABASE_URL) just serves the seed.
  await writeJsonFile(FILE[kind], seeded).catch(() => {});
  return seeded;
}

async function upsert<K extends Kind>(kind: K, doc: DocOf<K>) {
  const pool = await db();
  if (pool) {
    await seedOnce(pool, kind);
    await pool.query(
      `INSERT INTO ${TABLE[kind]} (slug, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [doc.slug, JSON.stringify(doc)],
    );
    return;
  }
  const all = await loadAll(kind);
  await writeJsonFile(FILE[kind], [...all.filter((d) => d.slug !== doc.slug), doc]);
}

async function remove(kind: Kind, slug: string) {
  const pool = await db();
  if (pool) {
    await seedOnce(pool, kind);
    await pool.query(`DELETE FROM ${TABLE[kind]} WHERE slug = $1`, [slug]);
    return;
  }
  const all = await loadAll(kind);
  await writeJsonFile(FILE[kind], all.filter((d) => d.slug !== slug));
}

// ---- Editing (admin) ----

export const listGuideDocs = async () => (await loadAll("guides")).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
export const getGuideDoc = async (slug: string) => (await loadAll("guides")).find((d) => d.slug === slug);
export const saveGuideDoc = (doc: GuideDoc) => upsert("guides", doc);
export const deleteGuideDoc = (slug: string) => remove("guides", slug);

export const listDiaryDocs = async () => (await loadAll("diary")).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
export const getDiaryDoc = async (slug: string) => (await loadAll("diary")).find((d) => d.slug === slug);
export const saveDiaryDoc = (doc: DiaryDoc) => upsert("diary", doc);
export const deleteDiaryDoc = (slug: string) => remove("diary", slug);

// ---- Public pages (same shapes as the old static content) ----

function toGuide({ th, en, ...meta }: GuideDoc): Guide {
  const loc = ({ body, ...rest }: GuideLocaleDoc) => ({ ...rest, blocks: markdownToBlocks(body) });
  return { ...meta, th: loc(th), en: loc(en) };
}
function toDiaryEntry({ th, en, ...meta }: DiaryDoc): DiaryEntry {
  const loc = ({ body, ...rest }: DiaryLocaleDoc) => ({ ...rest, blocks: markdownToBlocks(body) });
  return { ...meta, th: loc(th), en: loc(en) };
}

/** Per-request memo so generateMetadata and the page share one read. */
export const listGuides = cache(async (): Promise<Guide[]> => (await listGuideDocs()).map(toGuide));
export const getGuide = async (slug: string) => (await listGuides()).find((g) => g.slug === slug);
export const listDiary = cache(async (): Promise<DiaryEntry[]> => (await listDiaryDocs()).map(toDiaryEntry));
export const getDiaryEntry = async (slug: string) => (await listDiary()).find((d) => d.slug === slug);
