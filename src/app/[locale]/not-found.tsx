"use client";

import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <Container className="py-24 text-center">
      <p className="font-hand text-6xl text-rose">404</p>
      <h1 className="mt-4 text-3xl font-medium">{t.notFound.title}</h1>
      <p className="mt-2 text-ink-soft">{t.notFound.body}</p>
      <ButtonLink href={href("/", locale)} className="mt-8">
        {t.notFound.home}
      </ButtonLink>
    </Container>
  );
}
