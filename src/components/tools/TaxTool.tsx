"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { fmtPct, fmtTHB, taxRoom } from "@/lib/calc";
import { LeadForm } from "@/components/ui/LeadForm";
import { Bucket, Disclaimer, MoneyField, ResultCard, Segmented, Stat } from "./ToolKit";
import { ToolShell, TwoCol } from "./ToolShell";

export function TaxTool() {
  const { locale, t } = useI18n();
  const c = t.tools.tax;
  const [s, set] = useState({
    income: 720000,
    employee: true,
    spouseNoIncome: false,
    children: 0,
    parentsSupported: 0,
    pvd: 0,
    rmf: 0,
    homeLoanInterest: 0,
    existingLife: 0,
    existingHealth: 0,
    existingParentsHealth: 0,
    existingPension: 0,
  });
  const r = useMemo(() => taxRoom(s), [s]);
  const u = (k: keyof typeof s) => (v: number) => set((p) => ({ ...p, [k]: v }));
  const bucketLabel = { lifeHealth: c.bucketLifeHealth, parentsHealth: c.bucketParents, pension: c.bucketPension } as const;

  return (
    <ToolShell slug="tax" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      <TwoCol
        left={
          <>
            <MoneyField label={c.income} value={s.income} onChange={u("income")} max={5000000} step={10000} />
            <Segmented label={c.employee} value={s.employee ? 1 : 0} onChange={(v) => set((p) => ({ ...p, employee: v === 1 }))} options={[{ value: 1, label: c.employeeOptions[0] }, { value: 0, label: c.employeeOptions[1] }]} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Segmented label={c.spouse} value={s.spouseNoIncome ? 1 : 0} onChange={(v) => set((p) => ({ ...p, spouseNoIncome: v === 1 }))} options={[{ value: 0, label: t.common.no }, { value: 1, label: t.common.yes }]} />
              <MoneyField label={c.children} value={s.children} onChange={u("children")} max={6} step={1} money={false} stack />
            </div>
            <MoneyField label={c.parents} value={s.parentsSupported} onChange={u("parentsSupported")} max={4} step={1} money={false} />
            <details className="rounded-xl border border-line p-4">
              <summary className="cursor-pointer font-heading text-ink-soft">{locale === "th" ? "ค่าลดหย่อนอื่นที่มีอยู่แล้ว" : "Other deductions you already have"}</summary>
              <div className="mt-4 space-y-5">
                <MoneyField label={c.pvd} value={s.pvd} onChange={u("pvd")} max={500000} step={5000} />
                <MoneyField label={c.rmf} value={s.rmf} onChange={u("rmf")} max={500000} step={5000} />
                <MoneyField label={c.homeLoan} value={s.homeLoanInterest} onChange={u("homeLoanInterest")} max={100000} step={5000} />
              </div>
            </details>
            <div className="space-y-5">
              <MoneyField label={c.existingLife} value={s.existingLife} onChange={u("existingLife")} max={200000} step={1000} />
              <MoneyField label={c.existingHealth} value={s.existingHealth} onChange={u("existingHealth")} max={100000} step={1000} />
              <MoneyField label={c.existingParentsHealth} value={s.existingParentsHealth} onChange={u("existingParentsHealth")} max={50000} step={1000} />
              <MoneyField label={c.existingPension} value={s.existingPension} onChange={u("existingPension")} max={300000} step={5000} />
            </div>
          </>
        }
        right={
          <>
            <ResultCard title={c.resultTitle}>
              <div className="grid grid-cols-2 gap-3">
                <Stat label={c.estTax} value={fmtTHB(r.taxBefore, locale)} />
                <Stat label={c.marginal} value={fmtPct(r.marginal)} tone="honey" />
              </div>
              <div className="mt-6 space-y-5">
                {r.buckets.map((b) => (
                  <Bucket key={b.key} label={bucketLabel[b.key]} used={b.used} cap={b.cap} fullLabel={c.full} roomLabel={c.room} />
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-jasmine-ink text-white px-5 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70 font-heading">{c.savingIfFilled}</p>
                <p className="mt-1 font-heading text-3xl font-medium">
                  {fmtTHB(r.saving, locale)} <span className="text-base font-normal text-white/70">{c.saving.toLowerCase()}</span>
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {c.taxable}: {fmtTHB(r.taxableBefore, locale)} → {fmtTHB(r.taxableAfter, locale)}
                </p>
              </div>
              <Disclaimer text={c.note} />
            </ResultCard>
            <LeadForm source="tax" title={c.sendTitle} body={c.sendBody} payload={{ inputs: s, buckets: r.buckets, estimatedSaving: Math.round(r.saving), marginalRate: r.marginal }} />
          </>
        }
      />
    </ToolShell>
  );
}
