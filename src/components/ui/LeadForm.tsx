"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { Button, cx } from "./Button";
import { Icon } from "./Icon";
import type { LeadSource } from "@/lib/leads";

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
}

export function LeadForm({ source, title, body, payload, buttonLabel, compact, children, onSuccess, className, collect }: Props) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          locale,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          line: fd.get("line"),
          message: fd.get("message"),
          website: fd.get("website"),
          consent: fd.get("consent") === "on",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
          payload: { ...(payload ?? {}), ...(collect ? collect(form) : {}) },
        }),
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
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-soft text-sage-deep">
          <Icon name="check" className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-medium">{t.common.thanksTitle}</h3>
        <p className="mt-2 text-ink-soft">{t.common.thanksBody}</p>
      </div>
    );
  }

  const label = "block text-sm font-heading text-ink-soft mb-1.5";
  const input =
    "w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-ink focus:ring-4 focus:ring-rose/15 transition";

  return (
    <form onSubmit={submit} className={cx("card p-6 sm:p-8", className)} noValidate>
      {title && <h3 className="text-xl sm:text-2xl font-medium">{title}</h3>}
      {body && <p className="mt-2 text-ink-soft">{body}</p>}
      {payload && !compact && <p className="mt-2 text-xs text-ink-muted">{t.leadForm.includeResult}</p>}

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
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-rose" />
          <span>
            {t.common.consent}
            <Link href={href("/privacy", locale)} className="underline underline-offset-2 hover:text-ink">
              {t.common.consentLink}
            </Link>
            .
          </span>
        </label>
      </div>

      {state === "error" && (
        <p className="mt-4 rounded-xl bg-rose-soft px-4 py-2 text-sm text-rose-deep">
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
