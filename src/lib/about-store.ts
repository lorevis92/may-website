import "server-only";
import { cache } from "react";
import type { IconName } from "@/components/ui/Icon";
import { getMessages, type Locale } from "@/i18n";
import { readSetting, writeSetting } from "@/lib/db";
import { site } from "@/lib/site.config";

/**
 * Text of the About page (and the About teaser on the home page), edited by May in place on the page.
 * Only words and list items live here; layout and styling stay in the page components.
 * Until May saves something, the original copy from the i18n messages is used.
 */

export interface AboutLocale {
  eyebrow: string;
  title: string;
  /** Optional line under the title; hidden when empty. */
  subtitle: string;
  /** Bio in the Markdown dialect of lib/markdown.ts. */
  bio: string;
  howTitle: string;
  credTitle: string;
  valuesTitle: string;
}
export interface AboutStep {
  th: { title: string; body: string };
  en: { title: string; body: string };
}
/** One line of the credentials / what-she-does list, with its icon. */
export interface AboutSkill {
  icon: IconName;
  th: string;
  en: string;
}
export interface AboutDoc {
  th: AboutLocale;
  en: AboutLocale;
  how: AboutStep[];
  skills: AboutSkill[];
  values: { th: string; en: string }[];
}

/** Icons May can pick for list items (all already used across the site). */
export const ABOUT_ICONS: IconName[] = ["check", "shield", "heart", "sunrise", "sprout", "receipt", "book", "briefcase", "sparkle", "star", "chat", "clock", "lock", "globe", "pen"];

const KEY = "content:about";

export function defaultAbout(): AboutDoc {
  const m = { th: getMessages("th").about, en: getMessages("en").about };
  const loc = (l: Locale): AboutLocale => ({
    eyebrow: m[l].eyebrow,
    title: m[l].title,
    subtitle: "",
    bio: [m[l].p1.replace("{city}", site.contact.city[l]), m[l].p2, m[l].p3].join("\n\n"),
    howTitle: m[l].howTitle,
    credTitle: m[l].credTitle,
    valuesTitle: m[l].valuesTitle,
  });
  return {
    th: loc("th"),
    en: loc("en"),
    how: m.en.how.map((s, i) => ({ th: { title: m.th.how[i]?.t ?? "", body: m.th.how[i]?.b ?? "" }, en: { title: s.t, body: s.b } })),
    skills: m.en.cred.map((c, i) => ({ icon: "check", th: m.th.cred[i] ?? "", en: c })),
    values: m.en.values.map((v, i) => ({ th: m.th.values[i] ?? "", en: v })),
  };
}

/** Stored version merged over the defaults, so a missing field never blanks part of the page. */
export const getAbout = cache(async (): Promise<AboutDoc> => {
  const fallback = defaultAbout();
  let raw: string | undefined;
  try {
    raw = await readSetting(KEY);
  } catch (err) {
    console.error("[about] read failed, using the built-in copy", err);
  }
  if (!raw) return fallback;
  try {
    const saved = JSON.parse(raw) as Partial<AboutDoc>;
    return {
      th: { ...fallback.th, ...saved.th },
      en: { ...fallback.en, ...saved.en },
      how: saved.how ?? fallback.how,
      skills: saved.skills ?? fallback.skills,
      values: saved.values ?? fallback.values,
    };
  } catch {
    return fallback;
  }
});

export const saveAbout = (doc: AboutDoc) => writeSetting(KEY, JSON.stringify(doc));
