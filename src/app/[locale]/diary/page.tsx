import type { Metadata } from "next";
import Link from "next/link";
import { getMessages, isLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { diary } from "@/content";
import { Container, SectionTitle } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

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
  const t = getMessages(locale);
  return (
    <Container className="py-12 sm:py-16">
      <SectionTitle eyebrow={t.diary.eyebrow} title={t.diary.title} subtitle={t.diary.subtitle} />
      <div className="mx-auto max-w-3xl space-y-6">
        {diary.map((d, i) => (
          <Link key={d.slug} href={href(`/diary/${d.slug}`, locale)} className="card card-hover ruled block p-6 sm:p-8" style={{ transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
            <p className="font-hand text-rose-deep">{d.dateline[locale]}</p>
            <h2 className="mt-1 text-2xl font-medium">{d[locale].title}</h2>
            <p className="mt-3 text-ink-soft leading-relaxed">{d[locale].excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
              <time dateTime={d.date}>{formatDate(d.date, locale)}</time>
              {d.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-paper-2 px-2 py-0.5">
                  {tag}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-rose-deep normal-case tracking-normal text-sm">
                {t.diary.readEntry} <Icon name="arrow" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
