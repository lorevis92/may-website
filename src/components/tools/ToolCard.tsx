"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { TOOL_META, toneBg } from "./ToolShell";

import { toolMessageKey as keyOf, type ToolSlug } from "@/lib/tools";
export { TOOL_SLUGS, type ToolSlug } from "@/lib/tools";

export function ToolCard({ slug, index }: { slug: ToolSlug; index?: number }) {
  const { locale, t } = useI18n();
  const data = t.tools[keyOf[slug]];
  const meta = TOOL_META[slug];
  return (
    <Link href={href(`/tools/${slug}`, locale)} className="card card-hover group flex flex-col p-6" style={{ animationDelay: `${(index ?? 0) * 60}ms` }}>
      <div className="flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${toneBg[meta.tone]}`}>
          <Icon name={meta.icon} className="h-6 w-6" />
        </span>
        <span className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          <Icon name="clock" className="mr-1 inline h-3.5 w-3.5" />
          {data.minutes} {t.toolsSection.minutes}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-medium leading-snug">{data.name}</h3>
      <p className="mt-2 text-ink-soft text-[15px] leading-relaxed flex-1">{data.tagline}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 font-heading text-rose-deep">
        {t.toolsSection.open}
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
