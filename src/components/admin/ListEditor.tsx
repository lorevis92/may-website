"use client";

import { useState } from "react";
import { cx } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { inputCls, labelCls } from "./fields";

export interface ListField {
  /** Key in each item, e.g. "th", "en.title", "icon". */
  key: string;
  label: string;
  kind?: "text" | "textarea" | "icon";
  lang?: "th" | "en";
}
type Item = Record<string, string>;

/**
 * Editable list (add / edit / move / delete) for an admin form. The whole list is posted as JSON in
 * one hidden field named `name`; nothing is saved until the form is.
 */
export function ListEditor({ name, fields, initial, addLabel, icons = [] }: { name: string; fields: ListField[]; initial: Item[]; addLabel: string; icons?: IconName[] }) {
  const [items, setItems] = useState(() => initial.map((it, i) => ({ id: i, it })));
  const [nextId, setNextId] = useState(initial.length);

  const update = (id: number, key: string, value: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, it: { ...x.it, [key]: value } } : x)));
  const move = (from: number, to: number) =>
    setItems((xs) => {
      if (to < 0 || to >= xs.length) return xs;
      const copy = [...xs];
      const [x] = copy.splice(from, 1);
      copy.splice(to, 0, x);
      return copy;
    });
  const add = () => {
    const blank: Item = Object.fromEntries(fields.map((f) => [f.key, f.kind === "icon" ? (icons[0] ?? "check") : ""]));
    setItems((xs) => [...xs, { id: nextId, it: blank }]);
    setNextId((n) => n + 1);
  };
  const iconField = fields.find((f) => f.kind === "icon");
  const textFields = fields.filter((f) => f.kind !== "icon");
  const ctrl = "grid h-8 w-8 place-items-center rounded-md text-ink-soft hover:bg-paper-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(items.map((x) => x.it))} />
      {items.length === 0 && <p className="text-sm text-ink-muted">No items yet.</p>}
      {items.map(({ id, it }, index) => (
        <div key={id} className="flex gap-3 rounded-xl border border-line bg-paper/60 p-4">
          <span className="w-6 shrink-0 pt-2 font-heading text-sm tabular-nums text-ink-muted">{index + 1}</span>
          <div className="min-w-0 flex-1 space-y-3">
            {iconField && (
              <div className="flex items-center gap-3">
                <span className="icon-tile h-9 w-9 shrink-0">
                  <Icon name={(it[iconField.key] as IconName) || "check"} className="h-4 w-4" />
                </span>
                <select aria-label={iconField.label} value={it[iconField.key]} onChange={(e) => update(id, iconField.key, e.target.value)} className={cx(inputCls, "w-48 py-2")}>
                  {icons.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {textFields.map((f) => (
                <label key={f.key} className="block" lang={f.lang}>
                  <span className={labelCls}>{f.label}</span>
                  {f.kind === "textarea" ? (
                    <textarea value={it[f.key] ?? ""} onChange={(e) => update(id, f.key, e.target.value)} rows={2} className={cx(inputCls, "py-2.5")} />
                  ) : (
                    <input value={it[f.key] ?? ""} onChange={(e) => update(id, f.key, e.target.value)} className={cx(inputCls, "py-2.5")} />
                  )}
                </label>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className={ctrl} aria-label={`Move item ${index + 1} up`}>
              <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            </button>
            <button type="button" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} className={ctrl} aria-label={`Move item ${index + 1} down`}>
              <Icon name="arrow" className="h-4 w-4 rotate-90" />
            </button>
            <button type="button" onClick={() => setItems((xs) => xs.filter((x) => x.id !== id))} className={cx(ctrl, "hover:text-clay")} aria-label={`Remove item ${index + 1}`}>
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="rounded-[var(--radius-control)] border border-dashed border-line-strong px-4 py-2.5 text-sm font-heading text-ink-soft hover:border-jasmine hover:text-jasmine-deep">
        + {addLabel}
      </button>
    </div>
  );
}
