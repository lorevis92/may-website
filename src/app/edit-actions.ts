"use server";

import { revalidatePath } from "next/cache";
import type { IconName } from "@/components/ui/Icon";
import { isLocale, type Locale } from "@/i18n";
import { ABOUT_ICONS, getAbout, saveAbout } from "@/lib/about-store";
import { isAdmin } from "@/lib/auth";
import { deleteDiaryDoc, deleteGuideDoc, getDiaryDoc, getGuideDoc, listDiaryDocs, listGuideDocs, saveDiaryDoc, saveGuideDoc, type DiaryDoc, type GuideDoc } from "@/lib/content-store";
import type { CreateResult, EditResult, EditTarget, ListOp, LoadResult } from "@/lib/edit-types";
import { blocksToMarkdown, markdownToBlocks } from "@/lib/markdown";
import { baseString, getStats, loadTextDoc, saveTextDoc } from "@/lib/text-store";
import { TOOL_SLUGS } from "@/lib/tools";

/**
 * Server side of the in-place editor (components/edit). Every action checks the admin session itself,
 * edits exactly one field or list of one stored document, in the language passed by the page, and then
 * refreshes the public pages. Field paths are explained in lib/edit-types.ts.
 */

const GUIDE_ICONS: IconName[] = ["shield", "sunrise", "receipt", "sprout", "heart", "book"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Path = (string | number)[];
type Kind =
  | { k: "text"; max: number; required?: boolean }
  | { k: "markdown" }
  | { k: "int"; min: number; max: number }
  | { k: "date" }
  | { k: "icon"; icons: IconName[] }
  | { k: "tool" }
  | { k: "tags" };
interface Field {
  path: Path;
  kind: Kind;
  /** Set for "body@3": edit one block of the Markdown field at `path`. */
  block?: number;
}
interface ListSpec {
  path: Path;
  /** Markdown field edited as a list of blocks. */
  blocks?: boolean;
  /** New item from its first text; bilingual items start with the same words in both languages. */
  make?: (text: string) => unknown;
  max: number;
}
interface Opened {
  doc: Record<string, unknown>;
  save: () => Promise<void>;
}

const say = (l: Locale, th: string, en: string) => (l === "th" ? th : en);
const fail = (message: string) => ({ ok: false as const, message });
const todayInBangkok = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
const refreshSite = () => {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
};
const notSignedIn = (l: Locale) => fail(say(l, "หมดเวลาเข้าสู่ระบบ กรุณาเข้าสู่ระบบอีกครั้งที่ /admin/login", "Your session has ended. Please log in again at /admin/login."));

const text = (max: number, required = false): Kind => ({ k: "text", max, required });

function resolveField(target: EditTarget, l: Locale, raw: string): Field | null {
  const blockMatch = /^(bio|body)@(\d+)$/.exec(raw);
  const name = blockMatch ? blockMatch[1] : raw;
  let m: RegExpExecArray | null;
  let field: Field | null = null;

  if (target.t === "about") {
    if ((m = /^(eyebrow|title|subtitle|howTitle|credTitle|valuesTitle)$/.exec(name))) field = { path: [l, m[1]], kind: text(m[1] === "subtitle" ? 400 : 200, m[1] === "title") };
    else if (name === "bio") field = { path: [l, "bio"], kind: { k: "markdown" } };
    else if ((m = /^skills\.(\d+)$/.exec(name))) field = { path: ["skills", +m[1], l], kind: text(240, true) };
    else if ((m = /^skills\.(\d+)\.icon$/.exec(name))) field = { path: ["skills", +m[1], "icon"], kind: { k: "icon", icons: ABOUT_ICONS } };
    else if ((m = /^how\.(\d+)\.(title|body)$/.exec(name))) field = { path: ["how", +m[1], l, m[2]], kind: text(m[2] === "title" ? 120 : 500, m[2] === "title") };
    else if ((m = /^values\.(\d+)$/.exec(name))) field = { path: ["values", +m[1], l], kind: text(240, true) };
  } else if (target.t === "guide") {
    if (name === "title") field = { path: [l, "title"], kind: text(200, true) };
    else if (name === "subtitle") field = { path: [l, "subtitle"], kind: text(400) };
    else if (name === "readingMinutes") field = { path: [l, "readingMinutes"], kind: { k: "int", min: 1, max: 60 } };
    else if ((m = /^summary\.(\d+)$/.exec(name))) field = { path: [l, "summary", +m[1]], kind: text(300, true) };
    else if (name === "body") field = { path: [l, "body"], kind: { k: "markdown" } };
    else if (name === "icon") field = { path: ["icon"], kind: { k: "icon", icons: GUIDE_ICONS } };
    else if (name === "relatedTool") field = { path: ["relatedTool"], kind: { k: "tool" } };
  } else if (target.t === "diary") {
    if (name === "title") field = { path: [l, "title"], kind: text(200, true) };
    else if (name === "excerpt") field = { path: [l, "excerpt"], kind: text(600) };
    else if (name === "dateline") field = { path: ["dateline", l], kind: text(120) };
    else if (name === "date") field = { path: ["date"], kind: { k: "date" } };
    else if (name === "tags") field = { path: ["tags"], kind: { k: "tags" } };
    else if (name === "body") field = { path: [l, "body"], kind: { k: "markdown" } };
  } else {
    if ((m = /^stats\.(yearsExperience|familiesHelped)$/.exec(name))) field = { path: ["stats", m[1]], kind: { k: "int", min: 1, max: 100_000 } };
    else if (name === "stats.responseTime") field = { path: ["stats", "responseTime", l], kind: text(60, true) };
    // Any UI string that exists in the built-in messages; stored flat under its dotted key.
    else if (baseString(l, name) !== undefined) field = { path: [l, name], kind: text(1000) };
  }

  if (!field) return null;
  if (blockMatch) return field.kind.k === "markdown" ? { ...field, block: +blockMatch[2] } : null;
  return field;
}

function resolveList(target: EditTarget, l: Locale, name: string): ListSpec | null {
  if (target.t === "about") {
    if (name === "skills") return { path: ["skills"], make: (v) => ({ icon: "check", th: v, en: v }), max: 20 };
    if (name === "how") return { path: ["how"], make: (v) => ({ th: { title: v, body: "" }, en: { title: v, body: "" } }), max: 12 };
    if (name === "values") return { path: ["values"], make: (v) => ({ th: v, en: v }), max: 12 };
    if (name === "bio") return { path: [l, "bio"], blocks: true, max: 60 };
  }
  if (target.t === "guide") {
    if (name === "summary") return { path: [l, "summary"], make: (v) => v, max: 8 };
    if (name === "body") return { path: [l, "body"], blocks: true, max: 400 };
  }
  if (target.t === "diary" && name === "body") return { path: [l, "body"], blocks: true, max: 400 };
  return null;
}

async function open(target: EditTarget): Promise<Opened | null> {
  switch (target.t) {
    case "about": {
      const doc = structuredClone(await getAbout()) as unknown as Record<string, unknown>;
      return { doc, save: () => saveAbout(doc as never) };
    }
    case "guide": {
      const doc = await getGuideDoc(String(target.slug));
      if (!doc) return null;
      return { doc: doc as never, save: () => saveGuideDoc({ ...doc, updated: todayInBangkok() }) };
    }
    case "diary": {
      const doc = await getDiaryDoc(String(target.slug));
      if (!doc) return null;
      return { doc: doc as never, save: () => saveDiaryDoc(doc) };
    }
    case "text": {
      const doc = structuredClone(await loadTextDoc());
      return { doc: doc as never, save: () => saveTextDoc(doc) };
    }
    default:
      return null;
  }
}

/** The object holding the last step of `path` (created on the way for the text overrides), or null if it doesn't exist. */
function parentOf(doc: Record<string, unknown>, path: Path, create: boolean): Record<string | number, unknown> | null {
  let node: unknown = doc;
  for (const step of path.slice(0, -1)) {
    if (node === null || typeof node !== "object") return null;
    const obj = node as Record<string | number, unknown>;
    if (obj[step] === undefined && create && typeof step === "string") obj[step] = {};
    node = obj[step];
  }
  return node !== null && typeof node === "object" ? (node as Record<string | number, unknown>) : null;
}

function exists(doc: Record<string, unknown>, path: Path): boolean {
  const parent = parentOf(doc, path, false);
  const last = path.at(-1)!;
  if (!parent) return false;
  return Array.isArray(parent) ? typeof last === "number" && last < parent.length : true;
}

async function readValue(target: EditTarget, l: Locale, doc: Record<string, unknown>, f: Field): Promise<string | undefined> {
  if (target.t === "text") {
    const key = String(f.path.at(-1));
    if (f.path[0] === "stats") {
      const stats = await getStats();
      if (key === "responseTime" || f.path[1] === "responseTime") return stats.responseTime[l];
      return String(stats[key as "yearsExperience" | "familiesHelped"] ?? "");
    }
    return (doc[l] as Record<string, string>)[key] ?? baseString(l, key);
  }
  if (!exists(doc, f.path)) return undefined;
  const value = parentOf(doc, f.path, false)![f.path.at(-1)!];
  if (f.kind.k === "tags") return Array.isArray(value) ? value.join(", ") : "";
  if (f.block !== undefined) {
    const blocks = markdownToBlocks(String(value ?? ""));
    return f.block < blocks.length ? blocksToMarkdown([blocks[f.block]]) : undefined;
  }
  return value === undefined || value === null ? "" : String(value);
}

/** Checks and converts what May typed into the stored value; a string result is the error to show. */
function parse(l: Locale, kind: Kind, input: string): { value: unknown } | string {
  const v = input.replace(/\r\n?/g, "\n");
  switch (kind.k) {
    case "text": {
      const s = v.trim();
      if (kind.required && !s) return say(l, "ช่องนี้เว้นว่างไม่ได้ (ถ้าต้องการเอาออก ให้กดลบ)", "This can't be empty (to remove it, use delete).");
      if (s.length > kind.max) return say(l, `ยาวเกินไป (สูงสุด ${kind.max} ตัวอักษร)`, `Too long (max ${kind.max} characters).`);
      return { value: s };
    }
    case "markdown":
      return v.length > 80_000 ? say(l, "ข้อความยาวเกินไป", "This text is too long.") : { value: v.trim() };
    case "int": {
      const n = Number(v.trim());
      if (!Number.isInteger(n) || n < kind.min || n > kind.max) return say(l, `ใส่ตัวเลข ${kind.min}–${kind.max}`, `Enter a whole number from ${kind.min} to ${kind.max}.`);
      return { value: n };
    }
    case "date":
      return DATE_RE.test(v.trim()) && !Number.isNaN(Date.parse(v.trim())) ? { value: v.trim() } : say(l, "กรุณาเลือกวันที่", "Please pick a date.");
    case "icon":
      return (kind.icons as string[]).includes(v) ? { value: v } : say(l, "ไอคอนไม่ถูกต้อง", "Unknown icon.");
    case "tool":
      return v === "" || (TOOL_SLUGS as readonly string[]).includes(v) ? { value: v || undefined } : say(l, "เครื่องมือไม่ถูกต้อง", "Unknown tool.");
    case "tags":
      return {
        value: v
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 10),
      };
  }
}

function lang(locale: string): Locale | null {
  return isLocale(locale) ? locale : null;
}

// ---- Fields ----

export async function loadField(target: EditTarget, locale: string, field: string): Promise<LoadResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  const f = resolveField(target, l, String(field));
  if (!f) return fail(say(l, "แก้ไขส่วนนี้ไม่ได้", "This part can't be edited."));
  const opened = await open(target);
  if (!opened) return fail(say(l, "ไม่พบหน้านี้แล้ว", "This page no longer exists."));
  const value = await readValue(target, l, opened.doc, f);
  return value === undefined ? fail(say(l, "ไม่พบเนื้อหานี้แล้ว ลองโหลดหน้าใหม่", "This content is gone. Try reloading the page.")) : { ok: true, value };
}

export async function saveField(target: EditTarget, locale: string, field: string, input: string): Promise<EditResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  const f = resolveField(target, l, String(field));
  if (!f) return fail(say(l, "แก้ไขส่วนนี้ไม่ได้", "This part can't be edited."));
  const parsed = parse(l, f.kind, String(input ?? ""));
  if (typeof parsed === "string") return fail(parsed);
  const opened = await open(target);
  if (!opened) return fail(say(l, "ไม่พบหน้านี้แล้ว", "This page no longer exists."));
  const { doc } = opened;

  if (target.t === "text" && f.path[0] !== "stats") {
    // Empty, or the same as the built-in copy: drop the override so the original wording is used.
    const overrides = doc[l] as Record<string, string>;
    const key = String(f.path[1]);
    if (!parsed.value || parsed.value === baseString(l, key)) delete overrides[key];
    else overrides[key] = parsed.value as string;
  } else {
    const parent = parentOf(doc, f.path, target.t === "text");
    const last = f.path.at(-1)!;
    if (!parent || !exists(doc, f.path)) return fail(say(l, "ไม่พบเนื้อหานี้แล้ว ลองโหลดหน้าใหม่", "This content is gone. Try reloading the page."));
    if (f.block !== undefined) {
      const blocks = markdownToBlocks(String(parent[last] ?? ""));
      if (f.block >= blocks.length) return fail(say(l, "ไม่พบย่อหน้านี้แล้ว ลองโหลดหน้าใหม่", "This paragraph is gone. Try reloading the page."));
      blocks.splice(f.block, 1, ...markdownToBlocks(String(parsed.value)));
      parent[last] = blocksToMarkdown(blocks);
    } else if (parsed.value === undefined) {
      delete parent[last];
    } else {
      parent[last] = parsed.value;
    }
  }
  await opened.save();
  refreshSite();
  return { ok: true };
}

// ---- Lists (items of the About page, guide key points, paragraphs of a text) ----

export async function editList(target: EditTarget, locale: string, list: string, op: ListOp, index: number, input = ""): Promise<EditResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  const spec = resolveList(target, l, String(list));
  if (!spec || !["insert", "delete", "up", "down"].includes(op) || !Number.isInteger(index) || index < 0) return fail(say(l, "แก้ไขส่วนนี้ไม่ได้", "This part can't be edited."));
  const opened = await open(target);
  if (!opened) return fail(say(l, "ไม่พบหน้านี้แล้ว", "This page no longer exists."));
  const parent = parentOf(opened.doc, spec.path, false);
  const last = spec.path.at(-1)!;
  if (!parent) return fail(say(l, "ไม่พบเนื้อหานี้แล้ว ลองโหลดหน้าใหม่", "This content is gone. Try reloading the page."));

  const items: unknown[] = spec.blocks ? markdownToBlocks(String(parent[last] ?? "")) : Array.isArray(parent[last]) ? [...(parent[last] as unknown[])] : [];
  if (op === "insert") {
    if (index > items.length) return fail(say(l, "ลองโหลดหน้าใหม่", "Please reload the page."));
    if (items.length >= spec.max) return fail(say(l, "รายการนี้เต็มแล้ว", "This list is full."));
    const value = String(input ?? "").replace(/\r\n?/g, "\n").trim();
    if (!value) return fail(say(l, "กรุณาพิมพ์ข้อความก่อน", "Please type something first."));
    if (value.length > (spec.blocks ? 20_000 : 500)) return fail(say(l, "ข้อความยาวเกินไป", "This text is too long."));
    items.splice(index, 0, ...(spec.blocks ? markdownToBlocks(value) : [spec.make!(value)]));
  } else {
    if (index >= items.length) return fail(say(l, "ไม่พบรายการนี้แล้ว ลองโหลดหน้าใหม่", "This item is gone. Try reloading the page."));
    if (op === "delete") items.splice(index, 1);
    else {
      const to = op === "up" ? index - 1 : index + 1;
      if (to < 0 || to >= items.length) return { ok: true };
      [items[index], items[to]] = [items[to], items[index]];
    }
  }
  parent[last] = spec.blocks ? blocksToMarkdown(items as never) : items;
  await opened.save();
  refreshSite();
  return { ok: true };
}

// ---- Guides and diary entries as a whole ----

function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** Creates a new guide or diary entry with just a title (the same in both languages until May translates it). */
export async function createEntry(kind: "guide" | "diary", locale: string, title: string): Promise<CreateResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  const name = String(title ?? "").trim().slice(0, 200);
  if (!name) return fail(say(l, "กรุณาตั้งชื่อก่อน", "Please give it a title first."));
  const existing = new Set((kind === "guide" ? await listGuideDocs() : await listDiaryDocs()).map((d) => d.slug));
  const today = todayInBangkok();
  const base = slugify(name) || `${kind === "guide" ? "guide" : "entry"}-${today}`;
  let slug = base;
  for (let n = 2; existing.has(slug); n++) slug = `${base}-${n}`;
  if (!SLUG_RE.test(slug)) return fail("Invalid name.");

  if (kind === "guide") {
    const guides = await listGuideDocs();
    const loc = { title: name, subtitle: "", readingMinutes: 5, summary: [], body: "" };
    const doc: GuideDoc = { slug, icon: "book", order: Math.max(0, ...guides.map((g) => g.order)) + 1, updated: today, th: { ...loc }, en: { ...loc } };
    await saveGuideDoc(doc);
  } else {
    const loc = { title: name, excerpt: "", body: "" };
    const doc: DiaryDoc = { slug, date: today, dateline: { th: "", en: "" }, tags: [], th: { ...loc }, en: { ...loc } };
    await saveDiaryDoc(doc);
  }
  refreshSite();
  return { ok: true, slug };
}

export async function deleteEntry(kind: "guide" | "diary", locale: string, slug: string): Promise<EditResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  await (kind === "guide" ? deleteGuideDoc(String(slug)) : deleteDiaryDoc(String(slug)));
  refreshSite();
  return { ok: true };
}

/** Moves a guide one place up or down in the list (orders are renumbered 1…n). */
export async function moveGuide(locale: string, slug: string, dir: "up" | "down"): Promise<EditResult> {
  const l = lang(locale);
  if (!l) return fail("Unknown language.");
  if (!(await isAdmin())) return notSignedIn(l);
  const guides = await listGuideDocs();
  const from = guides.findIndex((g) => g.slug === slug);
  const to = dir === "up" ? from - 1 : from + 1;
  if (from < 0) return fail(say(l, "ไม่พบคู่มือนี้แล้ว", "This guide no longer exists."));
  if (to < 0 || to >= guides.length) return { ok: true };
  [guides[from], guides[to]] = [guides[to], guides[from]];
  // One at a time: without a database each save rewrites the same JSON file.
  for (const [i, g] of guides.entries()) if (g.order !== i + 1) await saveGuideDoc({ ...g, order: i + 1 });
  refreshSite();
  return { ok: true };
}
