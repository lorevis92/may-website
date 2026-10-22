import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n";
import { href } from "@/i18n/config";
import { getGuide, listGuides } from "@/lib/content-store";
import { Blocks } from "@/components/ui/Blocks";
import { PrintButton } from "@/components/ui/PrintButton";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { TOOL_META, TOOL_SLUGS, toolMessageKey } from "@/lib/tools";
import { getSiteMessages } from "@/lib/text-store";
import { Editable, EditableBlocks, EditOnly, ListAdd, ListItemTools, Txt } from "@/components/edit/Editable";

export async function generateStaticParams() {
  const guides = await listGuides();
  return locales.flatMap((locale) => guides.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const guide = await getGuide(slug);
  if (!guide) return {};
  return { title: guide[locale].title, description: guide[locale].subtitle };
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guides/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = await getSiteMessages(locale);
  const guide = await getGuide(slug);
  if (!guide) notFound();
  const g = guide[locale];
  const noteLabel = locale === "th" ? "โน้ตจากเมย์" : "A note from May";
  const toolKey = guide.relatedTool;
  const toolName = toolKey ? t.tools[toolMessageKey[toolKey]].name : null;
  const G = { t: "guide", slug } as const;
  const toolOptions = [{ value: "", label: locale === "th" ? "— ไม่มี —" : "— None —" }, ...TOOL_SLUGS.map((k) => ({ value: k, label: t.tools[toolMessageKey[k]].name }))];

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href={href("/guides", locale)} className="no-print inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.guides.allGuides}
        </Link>
        <p className="kicker mt-8">
          <Txt k="guides.eyebrow" />
        </p>
        <h1 className="mt-4 text-[2rem] sm:text-[3rem] font-medium">
          <Editable target={G} field="title">
            {g.title}
          </Editable>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          <Editable target={G} field="subtitle" kind="textarea" placeholder={locale === "th" ? "+ คำอธิบายสั้น ๆ" : "+ Short description"}>
            {g.subtitle}
          </Editable>
        </p>
        <p className="mt-3 text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
          <Editable target={G} field="readingMinutes" kind="number">
            {g.readingMinutes}
          </Editable>{" "}
          {t.guides.readingTime} · {t.guides.updated} {new Date(guide.updated).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { year: "numeric", month: "short", day: "numeric" })}
        </p>

        <div className="card mt-10 p-6 sm:p-7">
          <p className="kicker">
            <Txt k="guides.keyTakeaways" />
          </p>
          <ul className="mt-3 space-y-2">
            {g.summary.map((s, i) => (
              <li key={i} className="relative flex gap-3">
                <ListItemTools target={G} list="summary" index={i} count={g.summary.length} inline />
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-jasmine" />
                <span>
                  <Editable target={G} field={`summary.${i}`}>{s}</Editable>
                </span>
              </li>
            ))}
          </ul>
          <ListAdd target={G} list="summary" count={g.summary.length} label="addPoint" className="mt-4" />
        </div>

        <article className="mt-10">
          <EditableBlocks target={G} list="body">
            <Blocks blocks={g.blocks} noteLabel={noteLabel} />
          </EditableBlocks>
          <div className="no-print mt-10 flex flex-wrap gap-3">
            <PrintButton />
          </div>
        </article>

        <EditOnly>
          {!toolKey && (
            <p className="no-print mt-12 text-sm text-ink-muted">
              {t.guides.relatedTool}:{" "}
              <Editable target={G} field="relatedTool" kind="select" options={toolOptions}>
                {locale === "th" ? "— ไม่มี —" : "— None —"}
              </Editable>
            </p>
          )}
        </EditOnly>
        {toolKey && toolName && (
          <div className="no-print mt-12 card p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="icon-tile h-11 w-11">
                <Icon name={TOOL_META[toolKey].icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-heading uppercase tracking-[0.12em] text-ink-muted">
                  <Txt k="guides.relatedTool" />
                </p>
                <p className="font-heading text-lg">
                  <Editable target={G} field="relatedTool" kind="select" options={toolOptions}>
                    {toolName}
                  </Editable>
                </p>
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
