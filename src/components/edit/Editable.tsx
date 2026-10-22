"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { deleteEntry, editList, moveGuide } from "@/app/edit-actions";
import { cx } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/client";
import type { EditKind, EditTarget } from "@/lib/edit-types";
import { useEdit, type EditorRequest } from "./EditProvider";

/*
 * Building blocks the pages wrap around their content. Outside edit mode they render exactly what they
 * wrap (no extra elements), so the public page is unchanged; in edit mode they make it clickable.
 */

const TEXT: EditTarget = { t: "text" };

/** Clicks inside cards that are links must not follow the link while editing. */
const stop = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const keyOpen = (e: React.KeyboardEvent<HTMLElement>, go: (el: HTMLElement) => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
    go(e.currentTarget);
  }
};

/** One piece of text (or number, date, icon…) of a stored document, edited in a popover next to it. */
export function Editable({
  target,
  field,
  kind = "text",
  placeholder,
  options,
  icons,
  previewClassName,
  block,
  restorable,
  children,
}: {
  target: EditTarget;
  field: string;
  kind?: EditKind;
  /** Shown in edit mode when the value is empty (so an empty subtitle can still be filled in). */
  placeholder?: string;
  options?: { value: string; label: string }[];
  icons?: IconName[];
  previewClassName?: string;
  /** Wraps block content (a div) instead of inline text. */
  block?: boolean;
  restorable?: boolean;
  children?: ReactNode;
}) {
  const { editing, open } = useEdit();
  if (!editing) return <>{children}</>;
  const empty = children === undefined || children === null || children === "" || children === false;
  const go = (el: HTMLElement) => open(el, { mode: "field", target, field, kind, options, icons, previewClassName, restorable } satisfies EditorRequest);
  const Tag = block ? "div" : "span";
  return (
    <Tag
      role="button"
      tabIndex={0}
      className="edit-target"
      onClick={(e) => {
        stop(e);
        go(e.currentTarget);
      }}
      onKeyDown={(e) => keyOpen(e, go)}
    >
      {empty ? <span className="edit-placeholder">{placeholder ?? "…"}</span> : children}
    </Tag>
  );
}

/** A UI string of the site (section titles, labels…), by its key in src/i18n/messages, with May's wording if she changed it. */
export function Txt({ k, kind = "text" }: { k: string; kind?: "text" | "textarea" }) {
  const { t } = useI18n();
  let node: unknown = t;
  for (const part of k.split(".")) node = node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined;
  const value = typeof node === "string" ? node : "";
  return (
    <Editable target={TEXT} field={k} kind={kind} restorable>
      {value}
    </Editable>
  );
}

/** Renders its children when `show` is true, and always in edit mode (e.g. an empty subtitle with its placeholder). */
export function Optional({ show, children }: { show: boolean; children: ReactNode }) {
  const { editing } = useEdit();
  return show || editing ? <>{children}</> : null;
}

/** Content that only exists in edit mode (add buttons and the like). */
export function EditOnly({ children }: { children: ReactNode }) {
  const { editing } = useEdit();
  return editing ? <>{children}</> : null;
}

/**
 * A long Markdown text rendered by <Blocks>: in edit mode every paragraph, heading, list, note… is
 * clickable on its own, and there are buttons to add a paragraph or edit the whole text at once.
 */
export function EditableBlocks({ target, list, previewClassName, children }: { target: EditTarget; list: "bio" | "body"; previewClassName?: string; children: ReactNode }) {
  const { editing, open, ui } = useEdit();
  if (!editing) return <>{children}</>;

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const root = e.currentTarget.querySelector<HTMLElement>(":scope > [data-blocks]");
    if (!root) return;
    let el = e.target as HTMLElement | null;
    while (el && el.parentElement !== root) el = el.parentElement;
    if (!el) return;
    stop(e);
    const blocks = Array.from(root.children);
    open(el, { mode: "block", target, list, index: blocks.indexOf(el), count: blocks.length, previewClassName });
  };
  const count = (btn: HTMLElement) => btn.closest("[data-edit-blocks]")?.querySelector(":scope > [data-blocks]")?.children.length ?? 0;

  return (
    <div data-edit-blocks onClick={onClick}>
      {children}
      <div className="no-print mt-4 flex flex-wrap gap-2">
        <AddButton onClick={(el) => open(el, { mode: "insert", target, list, index: count(el), kind: "markdown", previewClassName })}>{ui.addParagraph}</AddButton>
        <button
          type="button"
          onClick={(e) => open(e.currentTarget, { mode: "field", target, field: list, kind: "markdown", previewClassName })}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-2 text-sm font-heading text-ink-soft hover:bg-paper-2 hover:text-ink"
        >
          <Icon name="pen" className="h-4 w-4" /> {ui.editAll}
        </button>
      </div>
    </div>
  );
}

/** Dashed "+ Add …" button, only in edit mode. */
export function AddButton({ onClick, children, className }: { onClick: (el: HTMLElement) => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        stop(e);
        onClick(e.currentTarget);
      }}
      className={cx(
        "no-print inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-control)] border border-dashed border-jasmine/60 bg-jasmine-mist/40 px-4 py-2 text-sm font-heading text-jasmine-deep hover:border-jasmine hover:bg-jasmine-mist",
        className,
      )}
    >
      + {children}
    </button>
  );
}

/** "+ Add item" for a list of the About page or a guide's key points (inserted at the end). */
export function ListAdd({ target, list, count, label, className }: { target: EditTarget; list: string; count: number; label: "addItem" | "addStep" | "addPoint"; className?: string }) {
  const { editing, open, ui } = useEdit();
  if (!editing) return null;
  return (
    <AddButton className={className} onClick={(el) => open(el, { mode: "insert", target, list, index: count, kind: "text", bilingual: target.t === "about" })}>
      {ui[label]}
    </AddButton>
  );
}

/** "+ New guide" / "+ New diary entry": asks for a title, creates the page and opens it. */
export function EntryAdd({ kind, className }: { kind: "guide" | "diary"; className?: string }) {
  const { editing, open, ui } = useEdit();
  if (!editing) return null;
  return (
    <AddButton className={className} onClick={(el) => open(el, { mode: "create", kind })}>
      {kind === "guide" ? ui.newGuide : ui.newEntry}
    </AddButton>
  );
}

/**
 * Small ↑ ↓ ✕ bar for a list item. Delete asks first. By default it sits on the item's top corner (the item
 * needs `relative`); `inline` puts it at the end of a flex row instead, for tight lists where it would cover the text.
 */
function ToolPill({ index, count, move, remove, confirmText, inline }: { index: number; count: number; move?: (dir: "up" | "down") => Promise<unknown>; remove: () => Promise<unknown>; confirmText: string; inline?: boolean }) {
  const { ui } = useEdit();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const go = async (e: MouseEvent, fn: () => Promise<unknown>) => {
    stop(e);
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };
  const btn = "grid h-7 w-7 place-items-center rounded-full text-ink-soft hover:bg-paper-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <span
      className={cx(
        "no-print z-10 inline-flex items-center gap-0.5 rounded-full border border-line bg-white px-1 py-0.5 text-sm font-normal normal-case tracking-normal shadow-[var(--shadow-soft)]",
        inline ? "order-last ml-auto shrink-0 self-start" : "absolute -top-3 right-2",
      )}
      onClick={stop}
    >
      {confirming ? (
        <>
          <span className="px-2 text-clay">{confirmText}</span>
          <button type="button" disabled={busy} onClick={(e) => go(e, remove)} className="rounded-full bg-clay px-2.5 py-1 font-heading text-white">
            {ui.yes}
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              setConfirming(false);
            }}
            className="rounded-full px-2.5 py-1 font-heading text-ink-soft hover:bg-paper-2"
          >
            {ui.no}
          </button>
        </>
      ) : (
        <>
          {move && (
            <>
              <button type="button" disabled={busy || index === 0} onClick={(e) => go(e, () => move("up"))} className={btn} aria-label={ui.up} title={ui.up}>
                <Icon name="arrow" className="h-3.5 w-3.5 -rotate-90" />
              </button>
              <button type="button" disabled={busy || index >= count - 1} onClick={(e) => go(e, () => move("down"))} className={btn} aria-label={ui.down} title={ui.down}>
                <Icon name="arrow" className="h-3.5 w-3.5 rotate-90" />
              </button>
            </>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              stop(e);
              setConfirming(true);
            }}
            className={cx(btn, "hover:bg-clay-soft hover:text-clay")}
            aria-label={ui.remove}
            title={ui.remove}
          >
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </span>
  );
}

/** Move / delete for one item of a stored list. */
export function ListItemTools({ target, list, index, count, inline }: { target: EditTarget; list: string; index: number; count: number; inline?: boolean }) {
  const { editing, locale, run, ui } = useEdit();
  if (!editing) return null;
  return (
    <ToolPill
      index={index}
      count={count}
      move={(dir) => run(() => editList(target, locale, list, dir, index))}
      remove={() => run(() => editList(target, locale, list, "delete", index))}
      confirmText={target.t === "about" ? `${ui.confirmRemove} ${ui.confirmShared}` : ui.confirmRemove}
      inline={inline}
    />
  );
}

/** Move (guides only: the diary follows its dates) / delete for a whole guide or diary entry. */
export function EntryTools({ kind, slug, index, count }: { kind: "guide" | "diary"; slug: string; index: number; count: number }) {
  const { editing, locale, run, ui } = useEdit();
  if (!editing) return null;
  return (
    <ToolPill
      index={index}
      count={count}
      move={kind === "guide" ? (dir) => run(() => moveGuide(locale, slug, dir)) : undefined}
      remove={() => run(() => deleteEntry(kind, locale, slug))}
      confirmText={kind === "guide" ? ui.deleteGuide : ui.deleteEntry}
    />
  );
}
