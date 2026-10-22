import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { listGuides } from "@/lib/content-store";
import { getSiteMessages } from "@/lib/text-store";
import { Container, SectionTitle } from "@/components/ui/Section";
import { GuideCard } from "@/components/ui/GuideCard";
import { EntryAdd, EntryTools, Txt } from "@/components/edit/Editable";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.nav.guides, description: t.guides.subtitle };
}

export default async function GuidesPage({ params }: PageProps<"/[locale]/guides">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = await getSiteMessages(locale);
  const guides = await listGuides();
  return (
    <Container className="py-12 sm:py-16">
      <SectionTitle eyebrow={<Txt k="guides.eyebrow" />} title={<Txt k="guides.title" />} subtitle={<Txt k="guides.subtitle" kind="textarea" />} />
      <div className="grid gap-5 sm:grid-cols-2">
        {guides.map((g, i) => (
          <GuideCard key={g.slug} guide={g} locale={locale} t={t} tools={<EntryTools kind="guide" slug={g.slug} index={i} count={guides.length} />} />
        ))}
        <EntryAdd kind="guide" className="min-h-40" />
      </div>
    </Container>
  );
}
