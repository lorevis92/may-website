"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

import { TOOL_META, toneBg, type ToolSlug } from "@/lib/tools";
export { TOOL_META, toneBg };

export function ToolShell({ slug, name, tagline, intro, minutes, children }: { slug: ToolSlug; name: string; tagline: string; intro: string; minutes: number; children: ReactNode }) {
  const { locale, t } = useI18n();
  const meta = TOOL_META[slug];
  return (
    <Container className="py-10 sm:py-14">
      <Link href={href("/tools", locale)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.tools.index.title}
      </Link>
      <div className="mt-5 flex items-start gap-4">
        <span className={`h-14 w-14 shrink-0 ${toneBg[meta.tone]}`}>
          <Icon name={meta.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-[2rem] sm:text-[2.75rem] font-medium">{name}</h1>
          <p className="mt-1 text-ink-soft text-lg">{tagline}</p>
          <p className="mt-2 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
            <Icon name="clock" className="mr-1 inline h-3.5 w-3.5" />
            {minutes} {t.toolsSection.minutes}
          </p>
        </div>
      </div>
      <p className="mt-6 max-w-2xl text-ink-soft leading-relaxed">{intro}</p>
      <div className="mt-8">{children}</div>
    </Container>
  );
}

export function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="card p-6 sm:p-8 space-y-6">{left}</div>
      <div className="lg:sticky lg:top-24 space-y-6">{right}</div>
    </div>
  );
}
