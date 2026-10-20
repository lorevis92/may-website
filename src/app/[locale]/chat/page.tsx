import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ChatWithMay } from "@/components/chat/ChatWithMay";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.chat.title, description: t.chat.subtitle };
}

export default async function ChatPage({ params }: PageProps<"/[locale]/chat">) {
  const { locale: raw } = await params;
  const t = getMessages(isLocale(raw) ? raw : "th");
  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <Eyebrow>{t.chat.eyebrow}</Eyebrow>
        <h1 className="text-4xl sm:text-5xl font-medium leading-tight">{t.chat.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{t.chat.subtitle}</p>
      </div>
      <ChatWithMay />
    </Container>
  );
}
