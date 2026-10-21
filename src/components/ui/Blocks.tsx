import { Fragment } from "react";
import type { Block } from "@/content/types";
import { Icon } from "./Icon";

/** **bold** inside any block text (the editor's Markdown keeps it as-is). */
function inline(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i} className="font-semibold">{p}</strong> : <Fragment key={i}>{p}</Fragment>));
}

/** Renders the content block model used by guides, diary entries and the privacy notice. */
export function Blocks({ blocks, noteLabel, className = "prose-may text-[17px] leading-relaxed text-ink" }: { blocks: Block[]; noteLabel?: string; className?: string }) {
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="font-medium">
                {inline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-medium">
                {inline(b.text)}
              </h3>
            );
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i} className="space-y-1.5">
                {b.items.map((it, k) => (
                  <li key={k}>{inline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2">
                {b.items.map((it, k) => (
                  <li key={k}>{inline(it)}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <aside key={i} className="note my-6">
                {(b.title || noteLabel) && <p className="kicker mb-2">{b.title ?? noteLabel}</p>}
                <p>{inline(b.text)}</p>
              </aside>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-8 border-l-2 border-jasmine-bright pl-6 font-heading text-xl sm:text-[1.375rem] leading-snug tracking-[-0.01em] text-jasmine-ink">
                {inline(b.text)}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-xl border border-line bg-white">
                <table>
                  <thead>
                    <tr>
                      {b.headers.map((h, k) => (
                        <th key={k}>{inline(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, k) => (
                          <td key={k}>{inline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "disclaimer":
            return (
              <div key={i} className="mt-10 flex gap-3 rounded-xl border border-line px-5 py-4 text-sm text-ink-soft">
                <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
                <p>{inline(b.text)}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
