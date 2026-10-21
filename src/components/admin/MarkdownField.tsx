"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import { Blocks } from "@/components/ui/Blocks";
import { cx } from "@/components/ui/Button";
import { markdownToBlocks } from "@/lib/markdown";
import { inputCls, labelCls } from "./fields";

/** Thai pages swap the fonts via html[lang="th"]; the admin is lang="en", so the Thai preview sets the same variables itself. */
const THAI_FONTS = { "--heading": "var(--font-thai)", "--body": "var(--font-thai)", fontFamily: "var(--font-thai)" } as CSSProperties;

/**
 * Markdown body editor with a live preview rendered by the same pipeline as the public pages
 * (lib/markdown → components/ui/Blocks). Side by side on large screens, "Write" / "Preview" tabs on small ones.
 * The textarea keeps its `name`, so the form still saves the raw Markdown exactly as before.
 */
export function MarkdownField({
  name,
  label,
  lang,
  defaultValue = "",
  previewClassName,
  height = "h-[70vh]",
}: {
  name: string;
  label: string;
  lang: "th" | "en";
  defaultValue?: string;
  /** Text styling of the page the text appears on, when it isn't the guide/diary default. */
  previewClassName?: string;
  height?: string;
}) {
  const [text, setText] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const deferred = useDeferredValue(text);
  const blocks = useMemo(() => markdownToBlocks(deferred), [deferred]);
  const noteLabel = lang === "th" ? "โน้ตจากเมย์" : "A note from May";
  const tabCls = (on: boolean) =>
    cx("rounded-[var(--radius-control)] px-3 py-1.5 text-sm font-heading transition-colors", on ? "bg-jasmine-mist text-jasmine-deep" : "text-ink-soft hover:text-ink");

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={name} className={cx(labelCls, "mb-0")}>
          {label}
        </label>
        <div className="flex gap-1 lg:hidden" role="tablist" aria-label={label}>
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={tabCls(tab === "write")}>
            Write
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabCls(tab === "preview")}>
            Preview
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          id={name}
          name={name}
          value={text}
          onChange={(e) => setText(e.target.value)}
          lang={lang}
          spellCheck
          className={cx(inputCls, height, "min-h-[22rem] resize-y font-mono text-[14px] leading-relaxed", tab === "preview" && "hidden lg:block")}
        />
        <div className={cx("flex min-h-[22rem] flex-col overflow-hidden", height, "rounded-[var(--radius-control)] border border-line bg-paper", tab === "write" && "hidden lg:flex")}>
          <p className="border-b border-line bg-white/70 px-4 py-2 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">Preview</p>
          <div lang={lang} style={lang === "th" ? THAI_FONTS : undefined} className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
            {blocks.length ? <Blocks blocks={blocks} noteLabel={noteLabel} className={previewClassName} /> : <p className="text-sm text-ink-muted">Start writing on the left: the page will appear here as visitors see it.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
