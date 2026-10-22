"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { createEntry, editList, loadField, saveField } from "@/app/edit-actions";
import { cx } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { href } from "@/i18n/config";
import type { EditResult } from "@/lib/edit-types";
import { useEdit, type EditorRequest } from "./EditProvider";
import { MarkdownEditor } from "./MarkdownEditor";
import { inputCls, smallBtn } from "./styles";

const GAP = 8;
const MARGIN = 16;

/**
 * The small panel that opens next to the text May clicked: one field, Save / Cancel, and for paragraphs
 * of a long text also move / delete / add below. It sits on the page itself (no overlay), scrolls with it,
 * and always saves the language of the page.
 */
export function EditPopover({ anchor, initial, onClose }: { anchor: HTMLElement; initial: EditorRequest; onClose: () => void }) {
  const { locale, ui, notify } = useEdit();
  const router = useRouter();
  const [req, setReq] = useState(initial);
  const loads = req.mode === "field" || req.mode === "block";
  const [value, setValue] = useState("");
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(loads);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const kind = req.mode === "field" ? req.kind : req.mode === "insert" ? req.kind : req.mode === "block" ? "markdown" : "text";
  const wide = kind === "markdown";
  const noteLabel = locale === "th" ? "โน้ตจากเมย์" : "A note from May";
  const field = req.mode === "field" ? req.field : req.mode === "block" ? `${req.list}@${req.index}` : null;

  // Load the stored value (raw Markdown, not the rendered text) for the language of the page.
  useEffect(() => {
    if (!field || req.mode === "insert" || req.mode === "create") return;
    let live = true;
    loadField(req.target, locale, field)
      .then((res) => {
        if (!live) return;
        if (res.ok) {
          setValue(res.value);
          setOriginal(res.value);
        } else setError(res.message);
      })
      .catch(() => live && setError(ui.error))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [req, field, locale, ui.error]);

  // Place it under the clicked text (above when there's no room), inside the viewport horizontally.
  useLayoutEffect(() => {
    const place = () => {
      const r = anchor.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const width = Math.min(wide ? 980 : 460, vw - 2 * MARGIN);
      const left = wide ? (vw - width) / 2 : Math.min(Math.max(r.left, MARGIN), vw - width - MARGIN);
      const height = panel.current?.offsetHeight ?? 0;
      const below = r.bottom + GAP;
      const top = below + height > window.innerHeight && r.top - GAP - height > 0 ? r.top - GAP - height : below;
      setPos({ top: top + window.scrollY, left: left + window.scrollX, width });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [anchor, wide, loading, req.mode]);

  // Focus the field once it's placed and loaded (an element that is still hidden can't take focus).
  const focused = useRef(false);
  useEffect(() => {
    if (!pos || !panel.current) return;
    panel.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const field = panel.current.querySelector<HTMLElement>("input, textarea, select, button[aria-pressed]");
    if (field && !focused.current) {
      field.focus({ preventScroll: true });
      focused.current = true;
    }
  }, [pos, loading, req.mode]);

  const dirty = value !== original;

  // Closing by clicking elsewhere only when nothing was typed, so no change is lost by accident.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node) && !anchor.contains(e.target as Node) && !dirty) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [anchor, dirty, onClose]);

  const act = async (action: () => Promise<EditResult>, close = true) => {
    setPending(true);
    setError(null);
    try {
      const res = await action();
      if (!res.ok) {
        setError(res.message);
        return false;
      }
      if (close) {
        notify(ui.saved);
        onClose();
      }
      return true;
    } catch {
      setError(ui.error);
      return false;
    } finally {
      setPending(false);
    }
  };

  const save = async () => {
    if (pending || loading) return;
    switch (req.mode) {
      case "field":
        if (!dirty) return onClose();
        return act(() => saveField(req.target, locale, req.field, value));
      case "block":
        if (!dirty) return onClose();
        return act(() => saveField(req.target, locale, `${req.list}@${req.index}`, value));
      case "insert":
        return act(() => editList(req.target, locale, req.list, "insert", req.index, value));
      case "create": {
        setPending(true);
        setError(null);
        try {
          const res = await createEntry(req.kind, locale, value);
          if (!res.ok) return setError(res.message);
          onClose();
          router.push(href(`/${req.kind === "guide" ? "guides" : "diary"}/${res.slug}`, locale));
        } catch {
          setError(ui.error);
        } finally {
          setPending(false);
        }
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void save();
    else if (e.key === "Enter" && !e.shiftKey && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      void save();
    }
  };

  const select = (v: string) => setValue(v);

  let input: ReactNode;
  if (loading) input = <p className="py-3 text-sm text-ink-muted">{ui.loading}</p>;
  else if (kind === "markdown")
    input = <MarkdownEditor value={value} onChange={setValue} ui={ui} noteLabel={noteLabel} previewClassName={"previewClassName" in req ? req.previewClassName : undefined} />;
  else if (kind === "textarea") input = <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} className={cx(inputCls, "resize-y leading-relaxed")} />;
  else if (kind === "number") input = <input type="number" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className={cx(inputCls, "w-40")} />;
  else if (kind === "date") input = <input type="date" value={value} onChange={(e) => setValue(e.target.value)} className={cx(inputCls, "w-52")} />;
  else if (kind === "select" && req.mode === "field")
    input = (
      <select value={value} onChange={(e) => select(e.target.value)} className={inputCls}>
        {req.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  else if (kind === "icon" && req.mode === "field")
    input = (
      <div className="flex flex-wrap gap-2">
        {req.icons?.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => select(name)}
            aria-label={name}
            aria-pressed={value === name}
            className={cx("grid h-10 w-10 place-items-center rounded-lg border transition-colors", value === name ? "border-jasmine bg-jasmine-mist text-jasmine-deep" : "border-line text-ink-soft hover:border-jasmine")}
          >
            <Icon name={name} className="h-5 w-5" />
          </button>
        ))}
      </div>
    );
  else
    input = (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
       
        placeholder={req.mode === "create" ? ui.newTitle : undefined}
        className={inputCls}
      />
    );

  const listAction = (op: "up" | "down" | "delete") => {
    if (req.mode !== "block") return;
    void act(() => editList(req.target, locale, req.list, op, req.index));
  };

  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-label={ui.editing}
      onKeyDown={onKeyDown}
      style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { visibility: "hidden", top: 0, left: 0 }}
      className="no-print absolute z-[80] rounded-2xl border border-line bg-white p-4 text-left text-base font-normal normal-case tracking-normal text-ink shadow-[var(--shadow-lift)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          {req.mode === "create" ? (req.kind === "guide" ? ui.newGuide : ui.newEntry) : ui.savesIn}
        </p>
        <button type="button" onClick={onClose} aria-label={ui.cancel} className="grid h-7 w-7 place-items-center rounded-md text-ink-muted hover:bg-paper-2 hover:text-ink">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>

      {input}

      {req.mode === "field" && req.restorable && <p className="mt-2 text-xs text-ink-muted">{ui.emptyRestores}</p>}
      {(req.mode === "create" || (req.mode === "insert" && req.bilingual)) && <p className="mt-2 text-xs text-ink-muted">{req.mode === "create" ? ui.newHint : ui.newItemHint}</p>}
      {error && <p className="mt-3 rounded-lg bg-clay-soft px-3 py-2 text-sm text-clay">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void save()} disabled={pending || loading} className={cx(smallBtn, "bg-jasmine px-4 py-2 text-white hover:bg-jasmine-deep")}>
          {pending ? ui.saving : req.mode === "create" ? ui.create : ui.save}
        </button>
        <button type="button" onClick={onClose} className={cx(smallBtn, "text-ink-soft hover:bg-paper-2 hover:text-ink")}>
          {ui.cancel}
        </button>
        {req.mode === "block" && !loading && (
          <div className="ml-auto flex flex-wrap items-center gap-1">
            <button type="button" disabled={pending || req.index === 0} onClick={() => listAction("up")} className={cx(smallBtn, "text-ink-soft hover:bg-paper-2")} aria-label={ui.up} title={ui.up}>
              <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            </button>
            <button type="button" disabled={pending || req.index >= req.count - 1} onClick={() => listAction("down")} className={cx(smallBtn, "text-ink-soft hover:bg-paper-2")} aria-label={ui.down} title={ui.down}>
              <Icon name="arrow" className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setReq({ mode: "insert", target: req.target, list: req.list, index: req.index + 1, kind: "markdown", previewClassName: req.previewClassName });
                setValue("");
                setOriginal("");
                focused.current = false;
              }}
              className={cx(smallBtn, "text-jasmine-deep hover:bg-jasmine-mist")}
            >
              + {ui.addBelow}
            </button>
            {confirming ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-clay-soft px-2 py-1">
                <span className="px-1 text-sm text-clay">{ui.confirmRemove}</span>
                <button type="button" disabled={pending} onClick={() => listAction("delete")} className={cx(smallBtn, "bg-clay py-1 text-white")}>
                  {ui.yes}
                </button>
                <button type="button" onClick={() => setConfirming(false)} className={cx(smallBtn, "py-1 text-clay")}>
                  {ui.no}
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className={cx(smallBtn, "text-clay hover:bg-clay-soft")}>
                {ui.remove}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
