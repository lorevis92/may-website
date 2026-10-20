"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { Button, cx } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/ui/LeadForm";
import { Disclaimer, ResultCard } from "./ToolKit";
import { ToolShell } from "./ToolShell";

type ProfileKey = "starter" | "builder" | "protector" | "planner" | "legacy";

/** Score each profile from the answers (indexes into the option arrays). */
function scoreProfiles(a: number[]): ProfileKey {
  const s: Record<ProfileKey, number> = { starter: 0, builder: 0, protector: 0, planner: 0, legacy: 0 };
  const [age, dependants, income, cover, worry, saving] = a;
  // age
  [["starter", 3], ["builder", 2], ["planner", 1]].forEach(([k, v]) => age === 0 && (s[k as ProfileKey] += v as number));
  if (age === 1) { s.builder += 3; s.protector += 2; s.starter += 1; }
  if (age === 2) { s.protector += 3; s.planner += 2; s.legacy += 1; }
  if (age === 3) { s.planner += 4; s.legacy += 2; }
  if (age === 4) { s.legacy += 4; s.planner += 2; }
  // dependants
  if (dependants === 0) { s.starter += 3; }
  if (dependants === 1) { s.builder += 3; }
  if (dependants === 2) { s.protector += 4; }
  if (dependants === 3) { s.builder += 1; s.planner += 1; s.starter += 1; }
  if (dependants === 4) { s.protector += 4; s.legacy += 1; }
  // income type
  if (income === 2) { s.legacy += 2; }
  if (income === 3) { s.planner += 2; s.legacy += 2; }
  if (income === 1) { s.starter += 1; s.builder += 1; }
  // existing cover
  if (cover === 0) { s.starter += 2; }
  if (cover === 3) { s.planner += 1; s.legacy += 1; }
  // worry
  if (worry === 0 || worry === 1) { s.starter += 2; s.builder += 1; }
  if (worry === 2) { s.protector += 3; s.builder += 1; }
  if (worry === 3) { s.planner += 3; }
  if (worry === 4) { s.protector += 3; }
  if (worry === 5) { s.planner += 2; s.legacy += 2; }
  // saving habit
  if (saving === 3) { s.legacy += 1; s.planner += 1; }
  if (saving === 0) { s.starter += 1; }
  return (Object.entries(s).sort((x, y) => y[1] - x[1])[0][0] as ProfileKey) ?? "starter";
}

export function QuizTool() {
  const { t } = useI18n();
  const c = t.tools.quiz;
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const done = answers.length === c.questions.length && step >= c.questions.length;
  const profileKey = useMemo(() => (done ? scoreProfiles(answers) : null), [done, answers]);
  const profile = profileKey ? c.profiles[profileKey] : null;
  const q = c.questions[Math.min(step, c.questions.length - 1)];

  const choose = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
    window.setTimeout(() => setStep((s) => s + 1), 180);
  };

  return (
    <ToolShell slug="quiz" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      {!done ? (
        <div className="card p-6 sm:p-10 max-w-2xl">
          <div className="flex items-center gap-2" aria-hidden>
            {c.questions.map((_, i) => (
              <span key={i} className={cx("h-1.5 flex-1 rounded-full transition-colors", i < step ? "bg-rose" : i === step ? "bg-ink" : "bg-paper-3")} />
            ))}
          </div>
          <p className="mt-6 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
            {step + 1} / {c.questions.length}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-medium">{q.q}</h2>
          <div className="mt-6 grid gap-2.5">
            {q.options.map((o, i) => (
              <button
                key={o}
                type="button"
                onClick={() => choose(i)}
                className={cx(
                  "group flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left font-heading text-[16px] transition",
                  answers[step] === i ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink hover:-translate-y-0.5",
                )}
              >
                {o}
                <Icon name="arrow" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.common.previous}
            </Button>
          </div>
        </div>
      ) : (
        profile && (
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <ResultCard title={c.resultTitle}>
              <p className="font-heading text-3xl sm:text-4xl font-medium">{profile.name}</p>
              <p className="mt-3 text-ink-soft leading-relaxed">{profile.summary}</p>
              <h4 className="mt-6 font-heading text-sm uppercase tracking-[0.12em] text-ink-muted">{c.priorities}</h4>
              <ol className="mt-2 space-y-2">
                {profile.priorities.map((p, i) => (
                  <li key={p} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-white font-heading text-xs">{i + 1}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
              <h4 className="mt-6 font-heading text-sm uppercase tracking-[0.12em] text-ink-muted">{c.fits}</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.fits.map((f) => (
                  <span key={f} className="rounded-full bg-sage-soft px-3 py-1 text-sm font-heading text-sage-deep">
                    {f}
                  </span>
                ))}
              </div>
              <p className="note mt-6 text-[15px]">
                <b>{c.firstStep}:</b> {profile.firstStep}
              </p>
              <Disclaimer />
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setAnswers([]);
                  setStep(0);
                }}
              >
                <Icon name="refresh" className="h-4 w-4" /> {t.common.startOver}
              </Button>
            </ResultCard>
            <LeadForm
              source="quiz"
              title={c.sendTitle}
              body={c.sendBody}
              payload={{ profile: profile.name, answers: c.questions.map((qq, i) => ({ q: qq.q, a: qq.options[answers[i]] })) }}
            />
          </div>
        )
      )}
    </ToolShell>
  );
}
