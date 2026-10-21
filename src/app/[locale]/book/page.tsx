import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { Container, Eyebrow } from "@/components/ui/Section";
import { BookForm } from "@/components/ui/BookForm";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site.config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.book.title, description: t.book.subtitle };
}

export default async function BookPage({ params }: PageProps<"/[locale]/book">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Eyebrow>{t.nav.book}</Eyebrow>
          <h1 className="text-[2.5rem] sm:text-[3.25rem] font-medium">{t.book.title}</h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">{t.book.subtitle}</p>
          <p className="note mt-8">{t.book.promise}</p>
          {site.contact.lineUrl && (
            <div className="mt-8">
              <p className="text-sm text-ink-muted mb-2">{t.book.orLine}</p>
              <ButtonLink href={site.contact.lineUrl} variant="line" size="lg">
                <Icon name="line" className="h-5 w-5" /> LINE {site.contact.lineId}
              </ButtonLink>
            </div>
          )}
        </div>
        <BookForm />
      </div>
    </Container>
  );
}
