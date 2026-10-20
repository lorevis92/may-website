import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { privacy } from "@/content/privacy";
import { site } from "@/lib/site.config";
import { Blocks } from "@/components/ui/Blocks";
import { Container } from "@/components/ui/Section";
import type { Block } from "@/content/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.privacy.title, robots: { index: false } };
}

function fill(blocks: Block[]): Block[] {
  const rep = (s: string) => s.replaceAll("[EMAIL]", site.contact.email || "—").replaceAll("[PHONE]", site.contact.phone || "—");
  return blocks.map((b) => {
    if ("text" in b) return { ...b, text: rep(b.text) } as Block;
    if ("items" in b) return { ...b, items: b.items.map(rep) } as Block;
    return b;
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const p = privacy[locale];
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-medium">{p.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{p.updated}</p>
        <div className="mt-8">
          <Blocks blocks={fill(p.blocks)} />
        </div>
      </div>
    </Container>
  );
}
