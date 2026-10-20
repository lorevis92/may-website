import { en, type Messages } from "./messages/en";
import { th } from "./messages/th";
import type { Locale } from "./config";

export const messages: Record<Locale, Messages> = { en, th };

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.th;
}

export type { Messages };
export * from "./config";
