// Shared content model for long-form bilingual content (guides, diary, about).
// Everything is plain data so it can be rendered on the server and edited by hand.

export type Locale = "th" | "en";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** A warm, first-person aside from May — rendered like a sticky note in the margin. */
  | { type: "note"; title?: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  /** Callout for compliance / "not advice" reminders. */
  | { type: "disclaimer"; text: string };

export interface GuideLocaleContent {
  title: string;
  subtitle: string;
  readingMinutes: number;
  /** 3–5 one-line takeaways shown before the gate and at the top of the guide. */
  summary: string[];
  blocks: Block[];
}

export interface Guide {
  slug: string;
  /** One of the icon keys in components/ui/Icon.tsx */
  icon: "shield" | "sunrise" | "receipt" | "sprout" | "heart" | "book";
  order: number;
  /** ISO date of last content update */
  updated: string;
  /** Which free tool pairs naturally with this guide (route under /tools/) */
  relatedTool?: "quiz" | "coverage" | "retirement" | "tax" | "education" | "health-check";
  th: GuideLocaleContent;
  en: GuideLocaleContent;
}

export interface DiaryLocaleContent {
  title: string;
  excerpt: string;
  blocks: Block[];
}

export interface DiaryEntry {
  slug: string;
  /** ISO date */
  date: string;
  /** Short mood/emoji-free tag shown in the entry header, e.g. "Bangkok, rainy evening" */
  dateline: { th: string; en: string };
  tags: string[];
  th: DiaryLocaleContent;
  en: DiaryLocaleContent;
}
