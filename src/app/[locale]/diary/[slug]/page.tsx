import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n";
import { href } from "@/i18n/config";
import { getDiaryEntry, listDiary } from "@/lib/content-store";
import { Blocks } from "@/components/ui/Blocks";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site.config";
import { getSiteMessages } from "@/lib/text-store";
import { Editable, EditableBlocks, Optional, Txt } from "@/components/edit/Editable";

export async function generateStaticParams() {
  const diary = await listDiary();
  return locales.flatMap((locale) => diary.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const d = await getDiaryEntry(slug);
  if (!d) return {};
  return { title: d[locale].title, description: d[locale].excerpt };
}

export default async function DiaryEntryPage({ params }: PageProps<"/[locale]/diary/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = await getSiteMessages(locale);
  const d = await getDiaryEntry(slug);
  if (!d) notFound();
  const diary = await listDiary();
  const idx = diary.findIndex((x) => x.slug === slug);
  const newer = diary[idx - 1];
  const older = diary[idx + 1];
  const noteLabel = locale === "th" ? "โน้ตจากเมย์" : "A note from May";
  const D = { t: "diary", slug } as const;

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href={href("/diary", locale)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.diary.allEntries}
        </Link>
        <article className="card mt-6 p-6 sm:p-12">
          <Optional show={!!d.dateline[locale]}>
            <p className="kicker">
              <Editable target={D} field="dateline" placeholder={locale === "th" ? "+ สถานที่ / บรรยากาศ" : "+ Place / mood line"}>
                {d.dateline[locale]}
              </Editable>
            </p>
          </Optional>
          <h1 className="mt-4 text-[2rem] sm:text-[2.75rem] font-medium text-jasmine-ink">
            <Editable target={D} field="title">
              {d[locale].title}
            </Editable>
          </h1>
          <p className="mt-2 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
            <time dateTime={d.date}>
              <Editable target={D} field="date" kind="date">
                {new Date(d.date).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </Editable>
            </time>
          </p>
          <div className="mt-8">
            <EditableBlocks target={D} list="body">
              <Blocks blocks={d[locale].blocks} noteLabel={noteLabel} />
            </EditableBlocks>
          </div>
          <p className="mt-12 border-t border-line pt-6 font-heading text-lg font-medium text-jasmine-deep">— {site.name[locale]}</p>
        </article>

        <div className="mt-10 card p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-medium">
            <Txt k="diary.talkTitle" />
          </h2>
          <p className="mt-2 text-ink-soft">
            <Txt k="diary.talkBody" kind="textarea" />
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {site.contact.lineUrl && (
              <ButtonLink href={site.contact.lineUrl} variant="line">
                <Icon name="line" className="h-5 w-5" /> LINE
              </ButtonLink>
            )}
            <ButtonLink href={href("/book", locale)} variant="secondary">
              <Icon name="pen" className="h-5 w-5" /> {t.nav.book}
            </ButtonLink>
          </div>
        </div>

        <nav className="mt-8 flex justify-between gap-4 text-sm" aria-label="Diary navigation">
          {older ? (
            <Link href={href(`/diary/${older.slug}`, locale)} className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink">
              <Icon name="arrow" className="h-4 w-4 rotate-180" /> {older[locale].title}
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={href(`/diary/${newer.slug}`, locale)} className="inline-flex items-center gap-1.5 text-right text-ink-soft hover:text-ink">
              {newer[locale].title} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </Container>
  );
}
