"use client";

import { useId, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { cx } from "@/components/ui/Button";
import { fmtTHB } from "@/lib/calc";

/* ---------- Money / number slider with editable input ---------- */
export function MoneyField({
  label,
  help,
  value,
  onChange,
  min = 0,
  max,
  step,
  suffix,
  money = true,
  stack,
}: {
  label: string;
  help?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  step?: number;
  suffix?: string;
  money?: boolean;
  /** Label above the input (for narrow columns). */
  stack?: boolean;
}) {
  const { locale } = useI18n();
  const id = useId();
  const stepv = step ?? Math.max(1, Math.round((max - min) / 200));
  return (
    <div>
      <div className={stack ? "flex flex-col gap-1.5" : "flex items-end justify-between gap-3"}>
        <label htmlFor={id} className="text-sm font-heading text-ink-soft">
          {label}
        </label>
        <div className="flex items-center gap-1 font-heading text-ink">
          {money && <span className="text-ink-muted">฿</span>}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max * 10}
            step={stepv}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`${money ? "w-32" : "w-20"} rounded-xl border border-line bg-white px-2.5 py-1.5 text-right text-[15px] focus:outline-none focus:border-ink focus:ring-4 focus:ring-rose/15`}
          />
          {suffix && <span className="text-ink-muted text-sm">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={stepv}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
      />
      {help && <p className="mt-1 text-xs text-ink-muted">{help}</p>}
      {money && <p className="sr-only">{fmtTHB(value, locale)}</p>}
    </div>
  );
}

/* ---------- Percent slider ---------- */
export function PercentField({ label, value, onChange, min = 0, max = 0.12, step = 0.005 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-heading text-ink-soft">
          {label}
        </label>
        <span className="font-heading text-ink">{(value * 100).toFixed(1)}%</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" />
    </div>
  );
}

/* ---------- Segmented choice ---------- */
export function Segmented<T extends string | number>({ label, options, value, onChange }: { label?: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      {label && <p className="text-sm font-heading text-ink-soft mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={cx(
              "rounded-full border px-3.5 py-1.5 text-sm font-heading transition",
              o.value === value ? "bg-ink text-white border-ink" : "bg-white border-line text-ink-soft hover:border-ink hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Result tiles ---------- */
export function Stat({ label, value, tone = "ink", big, sub }: { label: string; value: string; tone?: "ink" | "rose" | "sage" | "honey"; big?: boolean; sub?: string }) {
  const tones = { ink: "text-ink", rose: "text-rose-deep", sage: "text-sage-deep", honey: "text-[#b47f22]" };
  return (
    <div className="rounded-2xl bg-paper-2/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted font-heading">{label}</p>
      <p className={cx("font-heading font-medium", tones[tone], big ? "text-3xl sm:text-4xl mt-1" : "text-xl mt-0.5")}>{value}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export function ResultCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx("card tape p-6 sm:p-8", className)}>
      <h3 className="font-hand text-2xl text-rose-deep">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Disclaimer({ text }: { text?: string }) {
  const { t } = useI18n();
  return <p className="mt-4 text-xs leading-relaxed text-ink-muted">{text ?? t.common.notAdviceShort}</p>;
}

/* ---------- Tiny bar/area chart (SVG, no deps) ---------- */
export function AreaChart({
  series,
  target,
  labels,
  height = 180,
}: {
  series: { x: number; y: number }[];
  /** Horizontal target line. */
  target?: number;
  labels: { x: string; needed: string; projected: string };
  height?: number;
}) {
  const { locale } = useI18n();
  const w = 600;
  const h = height;
  const pad = { l: 8, r: 8, t: 14, b: 26 };
  const maxY = Math.max(target ?? 0, ...series.map((p) => p.y)) * 1.08 || 1;
  const minX = series[0]?.x ?? 0;
  const maxX = series[series.length - 1]?.x ?? 1;
  const sx = (x: number) => pad.l + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad.l - pad.r);
  const sy = (y: number) => pad.t + (1 - y / maxY) * (h - pad.t - pad.b);
  const path = series.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");
  const area = `${path} L${sx(maxX).toFixed(1)} ${sy(0)} L${sx(minX).toFixed(1)} ${sy(0)} Z`;
  const ticks = [minX, Math.round((minX + maxX) / 2), maxX];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={`${labels.projected} / ${labels.needed}`}>
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c9a86" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5c9a86" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#area-fill)" />
      <path d={path} fill="none" stroke="#3f7a69" strokeWidth="3" strokeLinejoin="round" />
      {target !== undefined && (
        <>
          <line x1={pad.l} x2={w - pad.r} y1={sy(target)} y2={sy(target)} stroke="#e0637c" strokeWidth="2" strokeDasharray="6 6" />
          <text x={w - pad.r} y={sy(target) - 6} textAnchor="end" fontSize="12" fill="#c84a66" fontFamily="var(--font-display)">
            {labels.needed} {fmtTHB(target, locale, { compact: true })}
          </text>
        </>
      )}
      {ticks.map((tk, i) => (
        <text key={tk} x={sx(tk)} y={h - 8} textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"} fontSize="12" fill="#8a7e83" fontFamily="var(--font-display)">
          {labels.x} {tk}
        </text>
      ))}
      <text x={pad.l} y={pad.t} fontSize="12" fill="#3f7a69" fontFamily="var(--font-display)">
        {labels.projected}
      </text>
    </svg>
  );
}

/* ---------- Progress bar for buckets ---------- */
export function Bucket({ label, used, cap, fullLabel, roomLabel }: { label: string; used: number; cap: number; fullLabel: string; roomLabel: string }) {
  const { locale } = useI18n();
  const pct = cap > 0 ? Math.min(100, (used / cap) * 100) : 100;
  const room = Math.max(0, cap - used);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-heading text-ink">{label}</span>
        <span className={cx("font-heading", room > 0 ? "text-rose-deep" : "text-sage-deep")}>{room > 0 ? `${roomLabel} ${fmtTHB(room, locale)}` : fullLabel}</span>
      </div>
      <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-paper-3">
        <div className="h-full rounded-full bg-sage transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        {fmtTHB(used, locale)} / {fmtTHB(cap, locale)}
      </p>
    </div>
  );
}
