import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMessages, isLocale, locales } from "@/i18n";
import { href } from "@/i18n/config";
import { getGuide, guides } from "@/content";
import { Blocks } from "@/components/ui/Blocks";
import { GuideGate } from "@/components/ui/GuideGate";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { TOOL_META, toolMessageKey } from "@/lib/tools";

export function generateStaticParams() {
  return locales.flatMap((locale) => guides.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide[locale].title, description: guide[locale].subtitle };
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guides/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const g = guide[locale];
  // The first ~3 blocks (usually an h2 + two paragraphs) are the free preview.
  const splitAt = Math.min(4, g.blocks.length);
  const previewBlocks = g.blocks.slice(0, splitAt);
  const restBlocks = g.blocks.slice(splitAt);
  const noteLabel = locale === "th" ? "โน้ตจากเมย์" : "A note from May";
  const toolKey = guide.relatedTool;
  const toolName = toolKey ? t.tools[toolMessageKey[toolKey]].name : null;

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href={href("/guides", locale)} className="no-print inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.guides.allGuides}
        </Link>
        <p className="kicker mt-8">{t.guides.eyebrow}</p>
        <h1 className="mt-4 text-[2rem] sm:text-[3rem] font-medium">{g.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{g.subtitle}</p>
        <p className="mt-3 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          {g.readingMinutes} {t.guides.readingTime} · {t.guides.updated} {new Date(guide.updated).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { year: "numeric", month: "short", day: "numeric" })}
        </p>

        <div className="card mt-10 p-6 sm:p-7">
          <p className="kicker">{t.guides.keyTakeaways}</p>
          <ul className="mt-3 space-y-2">
            {g.summary.map((s) => (
              <li key={s} className="flex gap-3">
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-jasmine" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <article className="mt-10">
          <Suspense fallback={<Blocks blocks={g.blocks} noteLabel={noteLabel} />}>
            <GuideGate slug={guide.slug} title={g.title} preview={<Blocks blocks={previewBlocks} noteLabel={noteLabel} />}>
              <Blocks blocks={restBlocks} noteLabel={noteLabel} />
            </GuideGate>
          </Suspense>
        </article>

        {toolKey && toolName && (
          <div className="no-print mt-12 card p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="icon-tile h-11 w-11">
                <Icon name={TOOL_META[toolKey].icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">{t.guides.relatedTool}</p>
                <p className="font-heading text-lg">{toolName}</p>
              </div>
            </div>
            <ButtonLink href={href(`/tools/${toolKey}`, locale)}>
              {t.toolsSection.open} <Icon name="arrow" className="h-4 w-4" />
            </ButtonLink>
          </div>
        )}
      </div>
    </Container>
  );
}
