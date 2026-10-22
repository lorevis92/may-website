"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Blocks } from "@/components/ui/Blocks";
import { cx } from "@/components/ui/Button";
import { MARKDOWN_HELP, markdownToBlocks } from "@/lib/markdown";
import type { EditUi } from "./ui-text";
import { inputCls } from "./styles";

/**
 * Markdown textarea with a live preview rendered by the same pipeline as the page (lib/markdown → Blocks).
 * Side by side on large screens, "Write" / "Preview" tabs on small ones.
 */
export function MarkdownEditor({ value, onChange, ui, noteLabel, previewClassName }: { value: string; onChange: (v: string) => void; ui: EditUi; noteLabel: string; previewClassName?: string }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const deferred = useDeferredValue(value);
  const blocks = useMemo(() => markdownToBlocks(deferred), [deferred]);
  const tabCls = (on: boolean) => cx("rounded-[var(--radius-control)] px-3 py-1.5 text-sm font-heading transition-colors", on ? "bg-jasmine-mist text-jasmine-deep" : "text-ink-soft hover:text-ink");

  return (
    <div>
      <div className="mb-2 flex gap-1 lg:hidden" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={tabCls(tab === "write")}>
          {ui.write}
        </button>
        <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabCls(tab === "preview")}>
          {ui.preview}
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck
          className={cx(inputCls, "h-[45vh] min-h-[14rem] resize-y font-mono text-[14px] leading-relaxed", tab === "preview" && "hidden lg:block")}
        />
        <div className={cx("h-[45vh] min-h-[14rem] overflow-y-auto rounded-[var(--radius-control)] border border-line bg-paper px-5 py-4", tab === "write" && "hidden lg:block")}>
          {blocks.length ? <Blocks blocks={blocks} noteLabel={noteLabel} className={previewClassName} /> : <p className="text-sm text-ink-muted">{ui.previewEmpty}</p>}
        </div>
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-heading text-ink-soft hover:text-ink">{ui.format}</summary>
        <dl className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-[auto_1fr]">
          {MARKDOWN_HELP.map(([syntax, meaning]) => (
            <div key={syntax} className="contents">
              <dt>
                <code className="whitespace-pre rounded-md bg-paper-2 px-2 py-0.5 font-mono text-[12.5px] text-ink">{syntax}</code>
              </dt>
              <dd className="text-ink-soft">{meaning}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
