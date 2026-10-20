"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { Button, cx } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/ui/LeadForm";
import { Disclaimer, ResultCard } from "./ToolKit";
import { ToolShell } from "./ToolShell";

type Answer = 0 | 1 | 2; // yes / not sure / no

export function HealthCheckTool() {
  const { t } = useI18n();
  const c = t.tools.healthCheck;
  const [answers, setAnswers] = useState<(Answer | undefined)[]>(Array(c.questions.length).fill(undefined));
  const [submitted, setSubmitted] = useState(false);
  const complete = answers.every((a) => a !== undefined);

  const result = useMemo(() => {
    const score = answers.reduce<number>((s, a) => s + (a === 0 ? 1 : a === 1 ? 0.5 : 0), 0);
    const pct = score / c.questions.length;
    const level = pct >= 0.8 ? 2 : pct >= 0.5 ? 1 : 0;
    const gaps = c.questions.map((q, i) => ({ q, a: answers[i] })).filter((x) => x.a !== 0);
    return { score, pct, level, gaps };
  }, [answers, c.questions]);

  const labels = [t.common.yes, t.common.notSure, t.common.no];

  return (
    <ToolShell slug="health-check" name={c.name} tagline={c.tagline} intro={c.intro} minutes={c.minutes}>
      {!submitted ? (
        <div className="card p-6 sm:p-10 max-w-3xl">
          <ol className="space-y-6">
            {c.questions.map((q, i) => (
              <li key={q.q} className="border-b border-line pb-6 last:border-0 last:pb-0">
                <p className="font-heading text-lg">
                  <span className="mr-2 text-ink-muted">{i + 1}.</span>
                  {q.q}
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={q.q}>
                  {labels.map((l, v) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={answers[i] === v}
                      onClick={() => setAnswers((p) => p.map((x, k) => (k === i ? (v as Answer) : x)))}
                      className={cx(
                        "rounded-full border px-4 py-1.5 font-heading text-sm transition",
                        answers[i] === v ? (v === 0 ? "bg-sage text-white border-sage" : v === 2 ? "bg-rose text-white border-rose" : "bg-honey text-ink border-honey") : "bg-white border-line hover:border-ink",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <Button size="lg" className="mt-8" disabled={!complete} onClick={() => setSubmitted(true)}>
            {t.common.seeResult} <Icon name="arrow" className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <ResultCard title={c.resultTitle}>
            <div className="flex items-center gap-5">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ecdfd3" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={result.level === 2 ? "#5c9a86" : result.level === 1 ? "#e8b45a" : "#e0637c"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${result.pct * 264} 264`} />
                </svg>
                <span className="font-heading text-2xl font-medium">{Math.round(result.pct * 100)}%</span>
              </div>
              <div>
                <p className="font-heading text-2xl font-medium">{c.levels[result.level].name}</p>
                <p className="mt-1 text-ink-soft">{c.levels[result.level].body}</p>
              </div>
            </div>
            {result.gaps.length > 0 && (
              <>
                <h4 className="mt-6 font-heading text-sm uppercase tracking-[0.12em] text-ink-muted">{c.gaps}</h4>
                <ul className="mt-2 space-y-3">
                  {result.gaps.map((g) => (
                    <li key={g.q.q} className="rounded-2xl bg-paper-2/70 p-4">
                      <p className="font-heading">{g.q.q}</p>
                      <p className="mt-1 text-sm text-ink-soft">{g.q.why}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Disclaimer />
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSubmitted(false);
                setAnswers(Array(c.questions.length).fill(undefined));
              }}
            >
              <Icon name="refresh" className="h-4 w-4" /> {t.common.startOver}
            </Button>
          </ResultCard>
          <LeadForm source="health-check" title={c.sendTitle} body={c.sendBody} payload={{ score: `${Math.round(result.pct * 100)}%`, level: c.levels[result.level].name, answers: c.questions.map((q, i) => ({ q: q.q, a: labels[answers[i] ?? 1] })) }} />
        </div>
      )}
    </ToolShell>
  );
}
