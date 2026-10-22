import "server-only";
import { cache } from "react";
import { getMessages, type Locale, type Messages } from "@/i18n";
import { readSetting, writeSetting } from "@/lib/db";
import { site } from "@/lib/site.config";

/**
 * May's own wording for the site's fixed UI strings (section titles, labels, the trust strip…) and the
 * numbers in the stats row, edited in place on the pages. Only the strings she changed are stored;
 * everything else keeps the copy from src/i18n/messages and lib/site.config.
 */

export interface Stats {
  yearsExperience: number | null;
  familiesHelped: number | null;
  responseTime: { th: string; en: string };
}
interface TextDoc {
  th: Record<string, string>;
  en: Record<string, string>;
  stats: Partial<Stats>;
}

const KEY = "content:text";

export const loadTextDoc = cache(async (): Promise<TextDoc> => {
  let raw: string | undefined;
  try {
    raw = await readSetting(KEY);
  } catch (err) {
    console.error("[text] read failed, using the built-in copy", err);
  }
  try {
    const saved = raw ? (JSON.parse(raw) as Partial<TextDoc>) : {};
    return { th: saved.th ?? {}, en: saved.en ?? {}, stats: saved.stats ?? {} };
  } catch {
    return { th: {}, en: {}, stats: {} };
  }
});

export const saveTextDoc = (doc: TextDoc) => writeSetting(KEY, JSON.stringify(doc));

/** The built-in string at a dotted path ("pillars.items.2.title"), or undefined when it isn't a string. */
export function baseString(locale: Locale, key: string): string | undefined {
  let node: unknown = getMessages(locale);
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object" || !Object.hasOwn(node, part)) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Messages for a page, with May's saved wording laid over the built-in copy. */
export const getSiteMessages = cache(async (locale: Locale): Promise<Messages> => {
  const overrides = (await loadTextDoc())[locale];
  const keys = Object.keys(overrides).filter((k) => baseString(locale, k) !== undefined);
  if (!keys.length) return getMessages(locale);
  const merged = structuredClone(getMessages(locale)) as unknown as Record<string, unknown>;
  for (const key of keys) {
    const parts = key.split(".");
    let node = merged;
    for (const part of parts.slice(0, -1)) node = node[part] as Record<string, unknown>;
    node[parts.at(-1)!] = overrides[key];
  }
  return merged as unknown as Messages;
});

export const getStats = cache(async (): Promise<Stats> => {
  const saved = (await loadTextDoc()).stats;
  return {
    yearsExperience: saved.yearsExperience !== undefined ? saved.yearsExperience : site.stats.yearsExperience,
    familiesHelped: saved.familiesHelped !== undefined ? saved.familiesHelped : site.stats.familiesHelped,
    responseTime: { ...site.stats.responseTime, ...saved.responseTime },
  };
});
