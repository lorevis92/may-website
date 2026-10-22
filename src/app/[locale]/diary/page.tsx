import type { Metadata } from "next";
import Link from "next/link";
import { getMessages, isLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { listDiary } from "@/lib/content-store";
import { Container, SectionTitle } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { getSiteMessages } from "@/lib/text-store";
import { Editable, EditOnly, EntryAdd, EntryTools, Optional, Txt } from "@/components/edit/Editable";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.nav.diary, description: t.diary.subtitle };
}

export function formatDate(iso: string, locale: "th" | "en") {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
}

export default async function DiaryPage({ params }: PageProps<"/[locale]/diary">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = await getSiteMessages(locale);
  const diary = await listDiary();
  const tagsHint = locale === "th" ? "+ แท็ก (คั่นด้วยจุลภาค)" : "+ Tags (comma-separated)";
  return (
    <Container className="py-12 sm:py-16">
      <SectionTitle eyebrow={<Txt k="diary.eyebrow" />} title={<Txt k="diary.title" />} subtitle={<Txt k="diary.subtitle" kind="textarea" />} />
      <div className="mx-auto max-w-3xl space-y-6">
        <EntryAdd kind="diary" className="w-full py-4" />
        {diary.map((d, i) => {
          const D = { t: "diary", slug: d.slug } as const;
          return (
          <Link key={d.slug} href={href(`/diary/${d.slug}`, locale)} className="card card-hover relative block p-6 sm:p-8">
            <EntryTools kind="diary" slug={d.slug} index={i} count={diary.length} />
            <Optional show={!!d.dateline[locale]}>
              <p className="kicker">
                <Editable target={D} field="dateline" placeholder={locale === "th" ? "+ สถานที่ / บรรยากาศ" : "+ Place / mood line"}>
                  {d.dateline[locale]}
                </Editable>
              </p>
            </Optional>
            <h2 className="mt-3 text-2xl sm:text-[1.75rem] font-medium">
              <Editable target={D} field="title">
                {d[locale].title}
              </Editable>
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              <Editable target={D} field="excerpt" kind="textarea" placeholder={locale === "th" ? "+ เกริ่นสั้น ๆ" : "+ Short excerpt"}>
                {d[locale].excerpt}
              </Editable>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
              <time dateTime={d.date}>
                <Editable target={D} field="date" kind="date">
                  {formatDate(d.date, locale)}
                </Editable>
              </time>
              {d.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-2 py-0.5">
                  <Editable target={D} field="tags">
                    {tag}
                  </Editable>
                </span>
              ))}
              {d.tags.length === 0 && (
                <EditOnly>
                  <Editable target={D} field="tags" placeholder={tagsHint} />
                </EditOnly>
              )}
              <span className="ml-auto inline-flex items-center gap-1 font-medium text-jasmine-deep normal-case tracking-normal text-sm">
                {t.diary.readEntry} <Icon name="arrow" className="h-4 w-4" />
              </span>
            </div>
          </Link>
          );
        })}
      </div>
    </Container>
  );
}
