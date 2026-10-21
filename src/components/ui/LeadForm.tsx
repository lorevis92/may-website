"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { Button, buttonClass, cx } from "./Button";
import { Icon } from "./Icon";
import type { LeadSource } from "@/lib/leads";
import { fill, lineMessage, lineMessageUrl, newLeadRef } from "@/lib/line";
import { site } from "@/lib/site.config";
import { TOOL_SLUGS, toolMessageKey, type ToolSlug } from "@/lib/tools";

interface Props {
  source: LeadSource;
  title?: string;
  body?: string;
  /** Structured data to attach (tool inputs/results). */
  payload?: Record<string, unknown>;
  buttonLabel?: string;
  /** Show only the email field (used for guide unlocks). */
  compact?: boolean;
  /** Extra fields rendered above the contact fields (e.g. booking topic/time). */
  children?: React.ReactNode;
  onSuccess?: () => void;
  className?: string;
  /** Collect extra values from the form element on submit. */
  collect?: (form: HTMLFormElement) => Record<string, unknown>;
  /** Context line for the prefilled LINE message (e.g. a chat recap). Defaults to one derived from `source`. */
  lineContext?: string;
}

export function LeadForm({ source, title, body, payload, buttonLabel, compact, children, onSuccess, className, collect, lineContext }: Props) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");
  // One reference code per form, shared by the form submit and the LINE button.
  // Created on first use (not during render) so server and client markup match.
  const refCode = useRef<string | null>(null);
  const lineSaved = useRef(false);
  const lastExtra = useRef<Record<string, unknown>>({});
  const leadRef = () => (refCode.current ??= newLeadRef());

  function leadBody(form: HTMLFormElement | null, channel: "form" | "line") {
    const fd = form ? new FormData(form) : null;
    const extra = form && collect ? collect(form) : lastExtra.current;
    lastExtra.current = extra;
    return JSON.stringify({
      source,
      locale,
      name: fd?.get("name"),
      email: fd?.get("email"),
      phone: fd?.get("phone"),
      line: fd?.get("line"),
      message: fd?.get("message"),
      website: fd?.get("website"),
      // Tapping the LINE button is the consent action (its note links the privacy notice).
      consent: channel === "line" || fd?.get("consent") === "on",
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      payload: { ...(payload ?? {}), ...extra },
      ref: leadRef(),
      channel,
    });
  }

  /** One line about what the visitor just did, for the LINE message. No result numbers: May finds those by ref. */
  function contextLine(extra: Record<string, unknown>): string {
    const c = t.line.context;
    if (lineContext) return lineContext;
    if ((TOOL_SLUGS as readonly string[]).includes(source)) return fill(c.tool, { tool: t.tools[toolMessageKey[source as ToolSlug]].name });
    if (source === "guide" && typeof payload?.guideTitle === "string") return fill(c.guide, { guide: payload.guideTitle });
    if (source === "book" && extra.topic) return fill(c.book, { topic: String(extra.topic), when: String(extra.when ?? "") });
    return c.other;
  }

  function openLine(e: MouseEvent<HTMLAnchorElement>) {
    const form = e.currentTarget.closest("form");
    const extra = form && collect ? collect(form) : lastExtra.current;
    const ref = leadRef();
    // Point the real link at the prefilled message just before the browser follows it, so it is never popup-blocked.
    e.currentTarget.href = lineMessageUrl(
      lineMessage({ greeting: t.line.greeting, context: contextLine(extra), ask: source === "book" ? t.line.askBook : t.line.ask, ref: fill(t.line.ref, { ref }) }),
    );
    if (state === "done" || lineSaved.current) return; // already saved under this ref
    lineSaved.current = true;
    // keepalive lets the save finish even when the page is left or backgrounded for LINE.
    fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: leadBody(form, "line"), keepalive: true }).catch(() => {
      lineSaved.current = false;
    });
    // Deferred: unmounting the link inside its own click handler would cancel the navigation.
    if (onSuccess) window.setTimeout(onSuccess, 0);
  }

  const lineCta = (
    <a href={site.contact.lineUrl} target="_blank" rel="noopener" onClick={openLine} className={buttonClass("line", "lg", "w-full sm:w-auto")}>
      <Icon name="line" className="h-5 w-5" />
      {t.line.button}
    </a>
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: leadBody(form, "form"),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "failed");
      setState("done");
      onSuccess?.();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "failed");
    }
  }

  if (state === "done") {
    return (
      <div className={cx("card p-6 sm:p-8 text-center", className)}>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-jasmine-mist text-jasmine-deep">
          <Icon name="check" className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-medium">{t.common.thanksTitle}</h3>
        <p className="mt-2 text-ink-soft">{t.common.thanksBody}</p>
        {site.contact.lineId && (
          <div className="mt-5 border-t border-line pt-5">
            <p className="mb-3 text-sm text-ink-soft">{t.line.doneCta}</p>
            {lineCta}
          </div>
        )}
      </div>
    );
  }

  const label = "block text-sm font-heading text-ink-soft mb-1.5";
  const input =
    "w-full rounded-[var(--radius-control)] border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-jasmine focus:ring-4 focus:ring-jasmine/15 transition";

  return (
    <form onSubmit={submit} className={cx("card p-6 sm:p-8", className)} noValidate>
      {title && <h3 className="text-xl sm:text-[1.625rem] font-medium">{title}</h3>}
      {body && <p className="mt-2 text-ink-soft">{body}</p>}
      {payload && !compact && <p className="mt-2 text-xs text-ink-muted">{t.leadForm.includeResult}</p>}

      {site.contact.lineId && (
        <div className="mt-5">
          <div className="rounded-xl border border-[#06C755]/25 bg-[#06C755]/[0.06] p-4">
            {lineCta}
            <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
              {t.line.hint}
              <Link href={href("/privacy", locale)} className="underline decoration-ink-muted/40 underline-offset-2 hover:text-ink">
                {t.common.consentLink}
              </Link>
              .
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
            <span className="h-px flex-1 bg-line" />
            {t.line.or}
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {children}
        {!compact && (
          <div>
            <label htmlFor={`${source}-name`} className={label}>
              {t.common.name}
            </label>
            <input id={`${source}-name`} name="name" className={input} autoComplete="name" maxLength={120} />
          </div>
        )}
        <div className={cx(!compact && "grid gap-4 sm:grid-cols-2")}>
          <div>
            <label htmlFor={`${source}-email`} className={label}>
              {t.common.email} {compact ? "" : <span className="text-ink-muted">({t.common.optional})</span>}
            </label>
            <input id={`${source}-email`} name="email" type="email" className={input} autoComplete="email" inputMode="email" required={compact} maxLength={200} />
          </div>
          {!compact && (
            <div>
              <label htmlFor={`${source}-line`} className={label}>
                {t.common.line} / {t.common.phone} <span className="text-ink-muted">({t.common.optional})</span>
              </label>
              <input id={`${source}-line`} name="line" className={input} autoComplete="tel" maxLength={80} />
            </div>
          )}
        </div>
        {!compact && (
          <div>
            <label htmlFor={`${source}-message`} className={label}>
              {t.common.message} <span className="text-ink-muted">({t.common.optional})</span>
            </label>
            <textarea id={`${source}-message`} name="message" rows={3} className={input} maxLength={2000} />
          </div>
        )}
        {/* honeypot */}
        <div className="hidden" aria-hidden>
          <label>
            Website <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-jasmine" />
          <span>
            {t.common.consent}
            <Link href={href("/privacy", locale)} className="text-jasmine-deep underline decoration-jasmine/30 underline-offset-2 hover:decoration-jasmine">
              {t.common.consentLink}
            </Link>
            .
          </span>
        </label>
      </div>

      {state === "error" && (
        <p className="mt-4 rounded-[var(--radius-control)] bg-clay-soft px-4 py-2 text-sm text-clay">
          {error === "no_contact" ? (locale === "th" ? "กรุณากรอกอีเมล LINE หรือเบอร์โทรอย่างน้อยหนึ่งอย่างค่ะ" : "Please leave at least an email, LINE ID or phone number.") : t.common.errorGeneric}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? t.common.sending : (buttonLabel ?? t.leadForm.sendResult)}
        <Icon name="arrow" className="h-5 w-5" />
      </Button>
    </form>
  );
}
