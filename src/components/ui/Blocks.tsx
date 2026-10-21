import type { Block } from "@/content/types";
import { Icon } from "./Icon";

/** Renders the content block model used by guides, diary entries and the privacy notice. */
export function Blocks({ blocks, noteLabel }: { blocks: Block[]; noteLabel?: string }) {
  return (
    <div className="prose-may text-[17px] leading-relaxed text-ink">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="font-medium">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-medium">
                {b.text}
              </h3>
            );
          case "p":
            return <p key={i}>{b.text}</p>;
          case "ul":
            return (
              <ul key={i} className="space-y-1.5">
                {b.items.map((it, k) => (
                  <li key={k}>{it}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2">
                {b.items.map((it, k) => (
                  <li key={k}>{it}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <aside key={i} className="note my-6">
                {(b.title || noteLabel) && <p className="kicker mb-2">{b.title ?? noteLabel}</p>}
                <p>{b.text}</p>
              </aside>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-8 border-l-2 border-jasmine-bright pl-6 font-heading text-xl sm:text-[1.375rem] leading-snug tracking-[-0.01em] text-jasmine-ink">
                {b.text}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-xl border border-line bg-white">
                <table>
                  <thead>
                    <tr>
                      {b.headers.map((h, k) => (
                        <th key={k}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, k) => (
                          <td key={k}>{cell}</td>
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
                <p>{b.text}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
