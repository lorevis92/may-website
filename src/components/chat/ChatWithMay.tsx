"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
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

const LINK = /(\/(?:th|en)\/[a-z0-9\-/]+)/g;
const BOLD = /\*\*(.+?)\*\*/g;
const BULLET = /^\s*[-*•]\s+/;

/** Turns "/en/tools/retirement" style paths into links; everything else stays plain text. */
function renderLinks(text: string, key: string) {
  return text.split(LINK).map((p, i) =>
    i % 2 ? (
      <Link key={`${key}-${i}`} href={p} className="text-jasmine-deep underline decoration-jasmine/40 underline-offset-2 hover:decoration-jasmine">
        {p}
      </Link>
    ) : (
      <Fragment key={`${key}-${i}`}>{p}</Fragment>
    ),
  );
}

/** **bold** spans, with links still detected inside them. */
function renderInline(text: string, key: string) {
  // Drop a dangling "**" (usually a bold span still streaming in) instead of showing raw asterisks.
  if (text.replace(BOLD, "").includes("**")) text = text.replace(/\*\*(?!.*\*\*)/, "");
  return text.split(BOLD).map((p, i) =>
    i % 2 ? (
      <strong key={`${key}-${i}`} className="font-semibold text-ink">
        {renderLinks(p, `${key}-${i}`)}
      </strong>
    ) : (
      <Fragment key={`${key}-${i}`}>{renderLinks(p, `${key}-${i}`)}</Fragment>
    ),
  );
}

/**
 * The light markdown the model uses: paragraphs (blank line), line breaks, "- " bullet lists and **bold**.
 * Anything else is shown as plain text.
 */
function renderMarkdown(text: string) {
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  let cur: (typeof blocks)[number] | undefined;
  let gap = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      gap = true;
      continue;
    }
    const type = BULLET.test(raw) ? "ul" : "p";
    // A blank line splits paragraphs but not a list, so loosely spaced bullets stay one list.
    if (cur?.type !== type || (type === "p" && gap)) blocks.push((cur = { type, lines: [] }));
    cur.lines.push(type === "ul" ? raw.replace(BULLET, "").trim() : line);
    gap = false;
  }
  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i} className="list-disc space-y-1 pl-5 marker:text-jasmine">
        {b.lines.map((l, j) => (
          <li key={j} className="pl-0.5">
            {renderInline(l, `${i}-${j}`)}
          </li>
        ))}
      </ul>
    ) : (
      <p key={i}>
        {b.lines.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(l, `${i}-${j}`)}
          </Fragment>
        ))}
      </p>
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
      <div className="card flex flex-col overflow-hidden" style={{ minHeight: "min(72vh, 720px)" }}>
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-jasmine text-white font-heading text-lg font-semibold">
              {locale === "th" ? "ม" : "M"}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-jasmine-bright" />
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
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-line bg-white px-3 py-1.5 text-xs font-heading text-ink-soft hover:border-line-strong hover:text-ink"
          >
            <Icon name="refresh" className="h-3.5 w-3.5" /> {c.newChat}
          </button>
        </div>

        {/* messages */}
        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cx(
                  "max-w-[85%] break-words rounded-2xl px-4 py-3 text-[15.5px] leading-relaxed",
                  m.role === "user" ? "whitespace-pre-wrap rounded-br-md bg-jasmine-ink text-white" : "space-y-2.5 rounded-bl-md border border-line bg-white text-ink",
                )}
              >
                {m.content ? (m.role === "assistant" ? renderMarkdown(m.content) : m.content) : null}
                {m.pending && (
                  <span className="ml-1 inline-flex items-center gap-1 align-middle" aria-label={c.typing}>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-jasmine-bright [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-jasmine-bright [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-jasmine-bright [animation-delay:240ms]" />
                  </span>
                )}
              </div>
            </div>
          ))}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {c.suggestions.map((s) => (
                <button key={s} type="button" onClick={() => void send(s)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-heading text-ink-soft transition-colors hover:border-jasmine/50 hover:text-jasmine-deep">
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
              className="max-h-40 min-h-[48px] flex-1 resize-y rounded-[var(--radius-control)] border border-line bg-white px-4 py-3 text-ink focus:outline-none focus:border-jasmine focus:ring-4 focus:ring-jasmine/15"
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
            <p className="font-heading text-lg font-medium text-ink">{c.handoffTitle}</p>
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
