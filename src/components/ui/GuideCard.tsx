import Link from "next/link";
import type { ReactNode } from "react";
import type { Guide } from "@/content/types";
import type { Locale, Messages } from "@/i18n";
import { href } from "@/i18n/config";
import { Editable } from "@/components/edit/Editable";
import { Icon } from "./Icon";

const GUIDE_ICONS = ["shield", "sunrise", "receipt", "sprout", "heart", "book"] as const;

/** `tools`: the move / delete bar shown in edit mode on the guides page. */
export function GuideCard({ guide, locale, t, tools }: { guide: Guide; locale: Locale; t: Messages; tools?: ReactNode }) {
  const g = guide[locale];
  const target = { t: "guide", slug: guide.slug } as const;
  return (
    <Link href={href(`/guides/${guide.slug}`, locale)} className="card card-hover group relative flex flex-col p-6">
      {tools}
      <div className="flex items-center justify-between">
        <Editable target={target} field="icon" kind="icon" icons={[...GUIDE_ICONS]}>
          <span className="icon-tile h-11 w-11">
            <Icon name={guide.icon} className="h-5 w-5" />
          </span>
        </Editable>
        <span className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          <Editable target={target} field="readingMinutes" kind="number">
            {g.readingMinutes}
          </Editable>{" "}
          {t.guides.readingTime}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-medium leading-snug">
        <Editable target={target} field="title">
          {g.title}
        </Editable>
      </h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
        <Editable target={target} field="subtitle" kind="textarea" placeholder={locale === "th" ? "+ คำอธิบายสั้น ๆ" : "+ Short description"}>
          {g.subtitle}
        </Editable>
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-medium text-jasmine-deep">
        {t.common.readMore}
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
