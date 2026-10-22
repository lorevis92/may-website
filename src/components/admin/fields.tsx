import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/components/ui/Button";

/** Same field styling as the public forms (components/ui/LeadForm). */
export const inputCls =
  "w-full rounded-[var(--radius-control)] border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-jasmine focus:ring-4 focus:ring-jasmine/15 transition";
export const labelCls = "block text-sm font-heading text-ink-soft mb-1.5";

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className={labelCls}>{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function TextArea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cx(inputCls, "leading-relaxed", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cx(inputCls, props.className)} />;
}

export function PageHeader({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-medium">{title}</h1>
        {intro && <p className="mt-2 text-ink-soft">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

/** Two-step delete: the real button only appears after opening "Delete…". */
export function DeleteButton({ action, name, value, label = "Delete", confirm }: { action: (fd: FormData) => Promise<void>; name: string; value: string; label?: string; confirm: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm font-heading text-clay hover:underline">{label}…</summary>
      <form action={action} className="mt-2 flex flex-wrap items-center gap-3 rounded-xl bg-clay-soft px-4 py-3">
        <input type="hidden" name={name} value={value} />
        <span className="text-sm text-clay">{confirm}</span>
        <button type="submit" className="rounded-[var(--radius-control)] bg-clay px-3.5 py-2 text-sm font-heading text-white hover:brightness-95">
          Yes, delete
        </button>
      </form>
    </details>
  );
}
