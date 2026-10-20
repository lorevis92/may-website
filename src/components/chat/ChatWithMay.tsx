"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { Button, cx } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/ui/LeadForm";
import { site } from "@/lib/site.config";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 10);

/** Turns "/en/tools/retirement" style paths in assistant text into links; everything else stays plain text. */
function renderText(text: string) {
  const parts = text.split(/(\/(?:th|en)\/[a-z0-9\-/]+)/g);
  return parts.map((p, i) =>
    /^\/(th|en)\//.test(p) ? (
      <Link key={i} href={p} className="underline decoration-rose underline-offset-2 hover:text-rose-deep">
        {p}
      </Link>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ChatWithMay() {
  const { locale, t } = useI18n();
  const c = t.chat;
  const [messages, setMessages] = useState<Msg[]>([{ id: "intro", role: "assistant", content: c.intro }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const [handoffOpened, setShowHandoff] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userTurns = messages.filter((m) => m.role === "user").length;
  const showHandoff = handoffOpened || userTurns >= 3;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);


  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setInput("");
    const userMsg: Msg = { id: uid(), role: "user", content };
    const draft: Msg = { id: uid(), role: "assistant", content: "", pending: true };
    const history = [...messages.filter((m) => m.id !== "intro"), userMsg];
    setMessages((m) => [...m, userMsg, draft]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        if (err.error === "no_api_key") setNoKey(true);
        setMessages((m) => m.map((x) => (x.id === draft.id ? { ...x, pending: false, content: err.error === "no_api_key" ? c.errorNoKey : t.common.errorGeneric } : x)));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((m) => m.map((x) => (x.id === draft.id ? { ...x, content: snapshot } : x)));
      }
      setMessages((m) => m.map((x) => (x.id === draft.id ? { ...x, pending: false } : x)));
    } catch {
      setMessages((m) => m.map((x) => (x.id === draft.id ? { ...x, pending: false, content: t.common.errorGeneric } : x)));
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const transcript = messages.filter((m) => m.id !== "intro").map((m) => `${m.role === "user" ? "Visitor" : "May (AI)"}: ${m.content}`).join("\n\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="card ruled flex flex-col overflow-hidden" style={{ minHeight: "min(72vh, 720px)" }}>
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-rose text-white font-hand text-xl">
              {locale === "th" ? "ม" : "M"}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-sage" />
            </span>
            <div>
              <p className="font-heading leading-tight">{site.name[locale]}</p>
              <p className="text-xs text-ink-muted">{c.eyebrow}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages([{ id: "intro", role: "assistant", content: c.intro }]);
              setShowHandoff(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-heading text-ink-soft hover:border-ink hover:text-ink"
          >
            <Icon name="refresh" className="h-3.5 w-3.5" /> {c.newChat}
          </button>
        </div>

        {/* messages */}
        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cx(
                  "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15.5px] leading-relaxed shadow-soft",
                  m.role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-white text-ink font-hand text-[17px]",
                )}
              >
                {m.content ? renderText(m.content) : null}
                {m.pending && (
                  <span className="ml-1 inline-flex items-center gap-1 align-middle" aria-label={c.typing}>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-rose [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-rose [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-rose [animation-delay:240ms]" />
                  </span>
                )}
              </div>
            </div>
          ))}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {c.suggestions.map((s) => (
                <button key={s} type="button" onClick={() => void send(s)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-heading text-ink-soft hover:border-ink hover:text-ink">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* composer */}
        <form onSubmit={onSubmit} className="border-t border-line bg-white/80 p-3 backdrop-blur sm:p-4">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder={c.placeholder}
              disabled={noKey}
              className="max-h-40 min-h-[48px] flex-1 resize-y rounded-2xl border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:border-ink focus:ring-4 focus:ring-rose/15"
            />
            <Button type="submit" disabled={busy || noKey || !input.trim()} aria-label={c.send} className="h-12 w-12 !p-0">
              <Icon name="arrow" className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-ink-muted">{c.disclaimer}</p>
        </form>
      </div>

      <aside className="space-y-5">
        {showHandoff || noKey ? (
          <LeadForm source="chat" title={c.handoffTitle} body={c.handoffBody} buttonLabel={c.handoffButton} payload={{ transcript }} />
        ) : (
          <div className="card p-6">
            <p className="font-hand text-xl text-rose-deep">{c.handoffTitle}</p>
            <p className="mt-2 text-sm text-ink-soft">{c.handoffBody}</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowHandoff(true)}>
              <Icon name="pen" className="h-4 w-4" /> {c.handoffButton}
            </Button>
          </div>
        )}
        <div className="card p-6">
          <p className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">{t.footer.contact}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.contact.lineUrl && (
              <li>
                <a href={site.contact.lineUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                  <Icon name="line" className="h-4 w-4 text-[#06C755]" /> LINE {site.contact.lineId}
                </a>
              </li>
            )}
            <li>
              <Link href={href("/book", locale)} className="inline-flex items-center gap-2 hover:text-ink">
                <Icon name="pen" className="h-4 w-4" /> {t.nav.book}
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
