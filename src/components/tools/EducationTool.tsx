"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { education, fmtTHB } from "@/lib/calc";
import { LeadForm } from "@/components/ui/LeadForm";
import { Disclaimer, MoneyField, PercentField, ResultCard, Segmented, Stat } from "./ToolKit";
import { ToolShell, TwoCol } from "./ToolShell";

export function EducationTool() {
  const { locale, t } = useI18n();
  const c = t.tools.education;
  const [track, setTrack] = useState(1);
  const [s, set] = useState({ childAge: 3, startAge: 18, yearlyCostToday: c.tracks[1].yearly, studyYears: 4, educationInflation: 0.05, currentSavings: 0, returnRate: 0.04 });
  const r = useMemo(() => education(s), [s]);
  const u = (k: keyof typeof s) => (v: number) => set((p) => ({ ...p, [k]: v }));

  return (
    <ToolShell slug="education" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      <TwoCol
        left={
          <>
            <div className="grid grid-cols-2 gap-3">
              <MoneyField label={c.childAge} value={s.childAge} onChange={(v) => set((p) => ({ ...p, childAge: v, startAge: Math.max(v + 1, p.startAge) }))} min={0} max={17} step={1} money={false} stack />
              <MoneyField label={c.startAge} value={s.startAge} onChange={(v) => set((p) => ({ ...p, startAge: Math.max(p.childAge + 1, v) }))} min={15} max={22} step={1} money={false} stack />
            </div>
            <Segmented
              label={c.track}
              value={track}
              onChange={(i) => {
                setTrack(i);
                set((p) => ({ ...p, yearlyCostToday: c.tracks[i].yearly }));
              }}
              options={c.tracks.map((tr, i) => ({ value: i, label: tr.name }))}
            />
            <MoneyField label={c.yearlyCost} value={s.yearlyCostToday} onChange={u("yearlyCostToday")} max={3000000} step={10000} />
            <MoneyField label={c.years} value={s.studyYears} onChange={u("studyYears")} min={1} max={8} step={1} money={false} suffix={t.common.years} />
            <MoneyField label={c.currentSavings} value={s.currentSavings} onChange={u("currentSavings")} max={5000000} step={10000} />
            <PercentField label={c.inflation} value={s.educationInflation} onChange={u("educationInflation")} min={0} max={0.1} step={0.005} />
            <PercentField label={c.returnRate} value={s.returnRate} onChange={u("returnRate")} min={0} max={0.08} step={0.005} />
          </>
        }
        right={
          <>
            <ResultCard title={c.resultTitle}>
              <p className="font-heading text-4xl sm:text-5xl font-medium text-ink">{fmtTHB(r.futureCost, locale, { compact: true })}</p>
              <p className="mt-1 text-sm text-ink-muted">{c.inYears.replace("{n}", String(r.yearsUntil))}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label={`${c.monthlyNeeded} · ${c.startNow}`} value={fmtTHB(r.monthlyNow, locale)} tone="sage" sub={t.common.perMonth} />
                <Stat label={`${c.monthlyNeeded} · ${c.startLater}`} value={r.yearsUntil > 3 ? fmtTHB(r.monthlyIn3Years, locale) : "—"} tone="rose" sub={t.common.perMonth} />
              </div>
              <p className="note mt-5 text-[15px]">{c.payorNote}</p>
              <Disclaimer />
            </ResultCard>
            <LeadForm source="education" title={c.sendTitle} body={c.sendBody} payload={{ inputs: { ...s, track: c.tracks[track].name }, futureCost: Math.round(r.futureCost), monthlyNow: Math.round(r.monthlyNow) }} />
          </>
        }
      />
    </ToolShell>
  );
}
