import Link from "next/link";
import type { Guide } from "@/content/types";
import type { Locale, Messages } from "@/i18n";
import { href } from "@/i18n/config";
import { Icon } from "./Icon";

const tones: Record<Guide["icon"], string> = {
  shield: "bg-sage-soft text-sage-deep",
  sunrise: "bg-honey-soft text-[#b47f22]",
  receipt: "bg-sky-soft text-[#2f6c9a]",
  sprout: "bg-plum-soft text-plum",
  heart: "bg-rose-soft text-rose-deep",
  book: "bg-paper-2 text-ink",
};

export function GuideCard({ guide, locale, t }: { guide: Guide; locale: Locale; t: Messages }) {
  const g = guide[locale];
  return (
    <Link href={href(`/guides/${guide.slug}`, locale)} className="card card-hover group flex flex-col p-6">
      <div className="flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[guide.icon]}`}>
          <Icon name={guide.icon} className="h-6 w-6" />
        </span>
        <span className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          {g.readingMinutes} {t.guides.readingTime}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-medium leading-snug">{g.title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{g.subtitle}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 font-heading text-rose-deep">
        {t.common.readMore}
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
