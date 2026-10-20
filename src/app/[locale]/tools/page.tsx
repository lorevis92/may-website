import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { Container, SectionTitle } from "@/components/ui/Section";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOL_SLUGS } from "@/lib/tools";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.tools.index.title, description: t.tools.index.subtitle };
}

export default async function ToolsPage({ params }: PageProps<"/[locale]/tools">) {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return (
    <Container className="py-12 sm:py-16">
      <SectionTitle eyebrow={t.toolsSection.eyebrow} title={t.tools.index.title} subtitle={t.tools.index.subtitle} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_SLUGS.map((slug, i) => (
          <ToolCard key={slug} slug={slug} index={i} />
        ))}
      </div>
    </Container>
  );
}
