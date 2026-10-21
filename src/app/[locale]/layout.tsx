import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getMessages, isLocale, locales, type Locale } from "@/i18n";
import { I18nProvider } from "@/i18n/client";
import { site } from "@/lib/site.config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Splash } from "@/components/layout/Splash";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: t.meta.titleTemplate },
    description: t.meta.description,
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
    alternates: {
      canonical: `/${locale}`,
      languages: { th: "/th", en: "/en", "x-default": "/th" },
    },
    openGraph: {
      type: "website",
      siteName: t.meta.title,
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "th" ? "th_TH" : "en_US",
      images: [{ url: "/og/cover.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getMessages(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name[locale],
    description: t.meta.description,
    url: `${site.url}/${locale}`,
    areaServed: "TH",
    knowsLanguage: ["th", "en"],
    memberOf: { "@type": "Organization", name: "Million Dollar Round Table" },
    parentOrganization: { "@type": "Organization", name: site.company },
    address: { "@type": "PostalAddress", addressLocality: site.contact.city.en, addressCountry: "TH" },
  };

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col paper">
        <I18nProvider locale={locale} messages={t}>
          <Splash />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            {locale === "th" ? "ข้ามไปเนื้อหา" : "Skip to content"}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
