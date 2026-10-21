"use client";

import { useI18n } from "@/i18n/client";
import { site } from "@/lib/site.config";
import { LeadForm } from "./LeadForm";

const select =
  "w-full rounded-[var(--radius-control)] border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:border-jasmine focus:ring-4 focus:ring-jasmine/15 transition";

export function BookForm() {
  const { locale, t } = useI18n();
  const b = t.book;
  return (
    <LeadForm
      source="book"
      buttonLabel={b.button}
      collect={(form) => {
        const fd = new FormData(form);
        return { topic: fd.get("topic"), when: fd.get("when"), channel: fd.get("channel") };
      }}
    >
      <div>
        <label htmlFor="book-topic" className="block text-sm font-heading text-ink-soft mb-1.5">
          {b.topic}
        </label>
        <select id="book-topic" name="topic" className={select} defaultValue={b.topics[0]}>
          {b.topics.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="book-when" className="block text-sm font-heading text-ink-soft mb-1.5">
            {b.when}
          </label>
          <select id="book-when" name="when" className={select} defaultValue={site.bookingWindows[locale][0]}>
            {site.bookingWindows[locale].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="book-channel" className="block text-sm font-heading text-ink-soft mb-1.5">
            {b.channel}
          </label>
          <select id="book-channel" name="channel" className={select} defaultValue={b.channels[0]}>
            {b.channels.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
    </LeadForm>
  );
}
