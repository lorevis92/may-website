import { site } from "@/lib/site.config";

/**
 * Short reference code shown in the LINE message and stored on the lead, so May can find the full
 * details in /admin/leads. No 0/O, 1/I/L: it gets read off a phone screen and typed into a search box.
 */
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const LEAD_REF_RE = /^[A-HJKMNP-Z2-9]{6}$/;

export function newLeadRef(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
}

/** LINE deep link that opens a chat with May's Official Account with `text` already typed in. */
export function lineMessageUrl(text: string, lineId: string = site.contact.lineId): string {
  return `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(text)}`;
}

/** Greeting, one line of context, a soft ask and the reference code, one per line. */
export function lineMessage(parts: { greeting: string; context?: string; ask: string; ref: string }): string {
  return [parts.greeting, parts.context, parts.ask, parts.ref].filter(Boolean).join("\n");
}

/** Fills {placeholders} in a message template. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
}
