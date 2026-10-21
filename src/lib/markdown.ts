import type { Block } from "@/content/types";

/**
 * The small Markdown dialect May writes guides and diary entries in (see MARKDOWN_HELP),
 * converted to the content blocks the site already renders, and back (for migrating the old content).
 *
 *   ## Heading / ### Smaller heading
 *   - bullet          1. numbered
 *   > quote
 *   ::: note Optional title        ::: disclaimer
 *   text                           text
 *   :::                            :::
 *   | Header | Header |  (second row |---|---| optional)
 *   **bold** anywhere in text; a blank line starts a new paragraph.
 */
const BULLET = /^[-*•]\s+/;
const NUMBERED = /^\d+[.)]\s+/;
const FENCE = /^:::\s*(note|disclaimer)\b\s*(.*)$/i;
const TABLE_RULE = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));
}

export function markdownToBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  // Collects the following lines that match `re` (the current line included), returned with the marker stripped.
  const run = (i: number, re: RegExp, strip: RegExp) => {
    const out = [lines[i].trim().replace(strip, "")];
    while (i + 1 < lines.length && re.test(lines[i + 1].trim())) out.push(lines[++i].trim().replace(strip, ""));
    return { out, i };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flush();
      continue;
    }
    let m: RegExpExecArray | null;
    if ((m = FENCE.exec(line))) {
      flush();
      const body: string[] = [];
      while (++i < lines.length && lines[i].trim() !== ":::") if (lines[i].trim()) body.push(lines[i].trim());
      const text = body.join(" ");
      const title = m[2].trim();
      blocks.push(m[1].toLowerCase() === "disclaimer" ? { type: "disclaimer", text } : title ? { type: "note", title, text } : { type: "note", text });
    } else if ((m = /^(#{1,3})\s+(.*)$/.exec(line))) {
      flush();
      blocks.push({ type: m[1].length === 3 ? "h3" : "h2", text: m[2].trim() });
    } else if (BULLET.test(line)) {
      flush();
      const r = run(i, BULLET, BULLET);
      blocks.push({ type: "ul", items: r.out });
      i = r.i;
    } else if (NUMBERED.test(line)) {
      flush();
      const r = run(i, NUMBERED, NUMBERED);
      blocks.push({ type: "ol", items: r.out });
      i = r.i;
    } else if (line.startsWith(">")) {
      flush();
      const r = run(i, /^>/, /^>\s?/);
      blocks.push({ type: "quote", text: r.out.join(" ").trim() });
      i = r.i;
    } else if (line.startsWith("|")) {
      flush();
      const r = run(i, /^\|/, /^/);
      const rows = r.out.filter((l) => !TABLE_RULE.test(l)).map(cells);
      blocks.push({ type: "table", headers: rows[0] ?? [], rows: rows.slice(1) });
      i = r.i;
    } else {
      para.push(line);
    }
  }
  flush();
  return blocks;
}

const escCell = (s: string) => s.replace(/\|/g, "\\|");

export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.text}`;
        case "h3":
          return `### ${b.text}`;
        case "p":
          return b.text;
        case "ul":
          return b.items.map((it) => `- ${it}`).join("\n");
        case "ol":
          return b.items.map((it, k) => `${k + 1}. ${it}`).join("\n");
        case "quote":
          return `> ${b.text}`;
        case "note":
          return `::: note${b.title ? ` ${b.title}` : ""}\n${b.text}\n:::`;
        case "disclaimer":
          return `::: disclaimer\n${b.text}\n:::`;
        case "table":
          return [b.headers, b.headers.map(() => "---"), ...b.rows].map((r) => `| ${r.map(escCell).join(" | ")} |`).join("\n");
      }
    })
    .join("\n\n");
}

/** Cheat-sheet shown next to the editor. */
export const MARKDOWN_HELP: [string, string][] = [
  ["## Heading", "Section heading"],
  ["### Smaller heading", "Sub-heading"],
  ["**bold**", "Bold words inside any text"],
  ["- item", "Bullet list (one line per item)"],
  ["1. item", "Numbered list"],
  ["> text", "Big quote"],
  ["::: note Title\ntext\n:::", "Note from May (title optional)"],
  ["::: disclaimer\ntext\n:::", "Small print / not-advice box"],
  ["| A | B |\n|---|---|\n| 1 | 2 |", "Table (first row = headers)"],
  ["(blank line)", "Starts a new paragraph"],
];
