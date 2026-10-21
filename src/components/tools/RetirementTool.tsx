"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { fmtTHB, retirement } from "@/lib/calc";
import { LeadForm } from "@/components/ui/LeadForm";
import { AreaChart, Disclaimer, MoneyField, PercentField, ResultCard, Segmented, Stat } from "./ToolKit";
import { ToolShell, TwoCol } from "./ToolShell";

const PROFILES = [
  { pre: 0.03, post: 0.025 },
  { pre: 0.05, post: 0.035 },
  { pre: 0.07, post: 0.045 },
];

export function RetirementTool() {
  const { locale, t } = useI18n();
  const c = t.tools.retirement;
  const [profile, setProfile] = useState(1);
  const [s, set] = useState({ currentAge: 35, retireAge: 60, planUntilAge: 85, monthlySpendingToday: 30000, currentSavings: 500000, monthlySaving: 5000, inflation: 0.03 });
  const r = useMemo(() => retirement({ ...s, preRate: PROFILES[profile].pre, postRate: PROFILES[profile].post }), [s, profile]);
  const u = (k: keyof typeof s) => (v: number) => set((p) => ({ ...p, [k]: v }));

  return (
    <ToolShell slug="retirement" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      <TwoCol
        left={
          <>
            <div className="grid grid-cols-3 gap-3">
              <MoneyField label={c.currentAge} value={s.currentAge} onChange={(v) => set((p) => ({ ...p, currentAge: v, retireAge: Math.max(v + 1, p.retireAge) }))} min={18} max={70} step={1} money={false} stack />
              <MoneyField label={c.retireAge} value={s.retireAge} onChange={(v) => set((p) => ({ ...p, retireAge: Math.max(p.currentAge + 1, v), planUntilAge: Math.max(v + 1, p.planUntilAge) }))} min={40} max={75} step={1} money={false} stack />
              <MoneyField label={c.lifeExpectancy} value={s.planUntilAge} onChange={(v) => set((p) => ({ ...p, planUntilAge: Math.max(p.retireAge + 1, v) }))} min={65} max={100} step={1} money={false} stack />
            </div>
            <MoneyField label={c.spending} value={s.monthlySpendingToday} onChange={u("monthlySpendingToday")} max={200000} step={1000} />
            <MoneyField label={c.currentSavings} value={s.currentSavings} onChange={u("currentSavings")} max={20000000} step={50000} />
            <MoneyField label={c.monthlySaving} value={s.monthlySaving} onChange={u("monthlySaving")} max={100000} step={500} />
            <Segmented label={c.profile} value={profile} onChange={setProfile} options={c.profiles.map((label, i) => ({ value: i, label }))} />
            <PercentField label={c.inflation} value={s.inflation} onChange={u("inflation")} min={0} max={0.06} step={0.005} />
          </>
        }
        right={
          <>
            <ResultCard title={`${c.nestEgg} ${s.retireAge}`}>
              <p className="font-heading text-4xl sm:text-5xl font-medium text-ink">{fmtTHB(r.nestEggNeeded, locale, { compact: true })}</p>
              <p className="mt-1 text-sm text-ink-muted">
                ≈ {fmtTHB(r.monthlyAtRetirement, locale)} {t.common.perMonth} ({locale === "th" ? "มูลค่าเงินในปีที่เกษียณ" : "in retirement-year money"})
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label={c.projected} value={fmtTHB(r.projected, locale, { compact: true })} tone="sage" />
                <Stat label={c.gap} value={r.gap > 0 ? fmtTHB(r.gap, locale, { compact: true }) : "—"} tone={r.gap > 0 ? "honey" : "jasmine"} />
              </div>
              <div className="mt-5 rounded-xl bg-jasmine-ink text-white px-5 py-4">
                {r.gap > 0 ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.12em] text-white/70 font-heading">{c.needMonthly}</p>
                    <p className="mt-1 font-heading text-3xl font-medium">
                      +{fmtTHB(r.extraMonthlyNeeded, locale)} <span className="text-base font-normal text-white/70">{t.common.perMonth}</span>
                    </p>
                  </>
                ) : (
                  <p className="font-heading">{c.onTrack}</p>
                )}
              </div>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted font-heading mb-2">{c.chartTitle}</p>
                <AreaChart series={r.series.map((p) => ({ x: p.age, y: p.projected }))} target={r.nestEggNeeded} labels={{ x: t.common.age, needed: c.chartNeeded, projected: c.chartProjected }} />
              </div>
              <p className="note mt-5 text-[15px]">{c.pensionNote}</p>
              <Disclaimer />
            </ResultCard>
            <LeadForm
              source="retirement"
              title={c.sendTitle}
              body={c.sendBody}
              payload={{ inputs: { ...s, profile: c.profiles[profile] }, nestEggNeeded: Math.round(r.nestEggNeeded), projected: Math.round(r.projected), gap: Math.round(r.gap), extraMonthlyNeeded: Math.round(r.extraMonthlyNeeded) }}
            />
          </>
        }
      />
    </ToolShell>
  );
}
