import Link from "next/link";
import type { Guide } from "@/content/types";
import type { Locale, Messages } from "@/i18n";
import { href } from "@/i18n/config";
import { Icon } from "./Icon";

export function GuideCard({ guide, locale, t }: { guide: Guide; locale: Locale; t: Messages }) {
  const g = guide[locale];
  return (
    <Link href={href(`/guides/${guide.slug}`, locale)} className="card card-hover group flex flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="icon-tile h-11 w-11">
          <Icon name={guide.icon} className="h-5 w-5" />
        </span>
        <span className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          {g.readingMinutes} {t.guides.readingTime}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-medium leading-snug">{g.title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{g.subtitle}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-medium text-jasmine-deep">
        {t.common.readMore}
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
