import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { guides } from "@/content";
import { Container, SectionTitle } from "@/components/ui/Section";
import { GuideCard } from "@/components/ui/GuideCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.nav.guides, description: t.guides.subtitle };
}

export default async function GuidesPage({ params }: PageProps<"/[locale]/guides">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  return (
    <Container className="py-12 sm:py-16">
      <SectionTitle eyebrow={t.guides.eyebrow} title={t.guides.title} subtitle={t.guides.subtitle} />
      <div className="grid gap-5 sm:grid-cols-2">
        {guides.map((g) => (
          <GuideCard key={g.slug} guide={g} locale={locale} t={t} />
        ))}
      </div>
    </Container>
  );
}
