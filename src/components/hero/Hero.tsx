"use client";

import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sticker } from "@/components/ui/Section";
import { HeroCharacter } from "./HeroCharacter";

export function Hero() {
  const { locale, t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      {/* decorative scribbles */}
      <svg aria-hidden className="pointer-events-none absolute -left-10 top-16 h-40 w-40 text-rose/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 60c20-30 40-30 60 0s30 10 25-20" strokeLinecap="round" />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute right-6 top-10 h-24 w-24 text-sage/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M50 10l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" strokeLinejoin="round" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1 animate-fade-up">
          <p className="font-hand text-rose-deep text-lg">{t.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.6rem] font-medium text-ink">
            <span className="block">{t.hero.titleA}</span>
            <span className="block mt-2 scribble">{t.hero.titleB}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed">{t.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={href("/tools", locale)} size="lg">
              <Icon name="sparkle" className="h-5 w-5" />
              {t.hero.cta1}
            </ButtonLink>
            <ButtonLink href={href("/chat", locale)} size="lg" variant="secondary">
              <Icon name="chat" className="h-5 w-5" />
              {t.hero.cta2}
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Sticker tone="honey">
              <Icon name="sparkle" className="h-4 w-4" /> {t.hero.badge1}
            </Sticker>
            <Sticker tone="sage">
              <Icon name="heart" className="h-4 w-4" /> {t.hero.badge2}
            </Sticker>
            <Sticker tone="sky">
              <Icon name="globe" className="h-4 w-4" /> {t.hero.badge3}
            </Sticker>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <HeroCharacter />
        </div>
      </div>
    </section>
  );
}
