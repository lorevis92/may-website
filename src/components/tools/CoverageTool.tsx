"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { coverage, fmtTHB } from "@/lib/calc";
import { LeadForm } from "@/components/ui/LeadForm";
import { Disclaimer, MoneyField, ResultCard, Stat } from "./ToolKit";
import { ToolShell, TwoCol } from "./ToolShell";

export function CoverageTool() {
  const { locale, t } = useI18n();
  const c = t.tools.coverage;
  const [s, set] = useState({ monthlyIncome: 50000, yearsToReplace: 10, debts: 1500000, education: 1000000, finalExpenses: 300000, existingCover: 500000, savings: 300000 });
  const r = useMemo(() => coverage(s), [s]);
  const u = (k: keyof typeof s) => (v: number) => set((p) => ({ ...p, [k]: v }));

  return (
    <ToolShell slug="coverage" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      <TwoCol
        left={
          <>
            <MoneyField label={c.income} value={s.monthlyIncome} onChange={u("monthlyIncome")} max={300000} step={1000} />
            <MoneyField label={c.yearsToReplace} help={c.yearsHelp} value={s.yearsToReplace} onChange={u("yearsToReplace")} min={1} max={30} step={1} money={false} suffix={t.common.years} />
            <MoneyField label={c.debts} value={s.debts} onChange={u("debts")} max={20000000} step={50000} />
            <MoneyField label={c.education} value={s.education} onChange={u("education")} max={10000000} step={50000} />
            <MoneyField label={c.finalExpenses} value={s.finalExpenses} onChange={u("finalExpenses")} max={2000000} step={10000} />
            <MoneyField label={c.existingCover} value={s.existingCover} onChange={u("existingCover")} max={20000000} step={50000} />
            <MoneyField label={c.savings} value={s.savings} onChange={u("savings")} max={20000000} step={50000} />
          </>
        }
        right={
          <>
            <ResultCard title={c.resultTitle}>
              <p className="font-heading text-4xl sm:text-5xl font-medium text-ink">{fmtTHB(r.recommended, locale)}</p>
              <p className="mt-2 text-ink-soft">{r.recommended > 0 ? c.resultBody : c.covered}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label={c.needs} value={fmtTHB(r.needs, locale, { compact: true })} tone="rose" />
                <Stat label={c.has} value={fmtTHB(r.has, locale, { compact: true })} tone="sage" />
              </div>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-heading text-ink-soft">{c.breakdown}</summary>
                <table className="mt-2 w-full">
                  <tbody>
                    {[
                      [c.rowIncome, r.incomeNeed],
                      [c.rowDebts, s.debts],
                      [c.rowEducation, s.education],
                      [c.rowFinal, s.finalExpenses],
                      [c.rowExisting, -s.existingCover],
                      [c.rowSavings, -s.savings],
                    ].map(([label, v]) => (
                      <tr key={label as string} className="border-b border-line last:border-0">
                        <td className="py-1.5 text-ink-soft">{label as string}</td>
                        <td className={`py-1.5 text-right font-heading ${(v as number) < 0 ? "text-sage-deep" : ""}`}>
                          {(v as number) < 0 ? "−" : ""}
                          {fmtTHB(Math.abs(v as number), locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
              <p className="note mt-5 text-[15px]">{c.note}</p>
              <Disclaimer />
            </ResultCard>
            <LeadForm source="coverage" title={c.sendTitle} body={c.sendBody} payload={{ inputs: s, recommendedCover: Math.round(r.recommended) }} />
          </>
        }
      />
    </ToolShell>
  );
}
