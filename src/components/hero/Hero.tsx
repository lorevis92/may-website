"use client";

import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Section";
import { Txt } from "@/components/edit/Editable";
import { HeroCharacter } from "./HeroCharacter";

export function Hero() {
  const { locale } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 sm:pt-14 sm:pb-24 grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1 animate-fade-up">
          <p className="kicker inline-flex items-center gap-2.5">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-jasmine-bright" />
            <Txt k="hero.eyebrow" />
          </p>
          <h1 className="mt-5 text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-medium text-ink">
            <span className="block"><Txt k="hero.titleA" /></span>
            <span className="block mt-1 text-jasmine"><Txt k="hero.titleB" /></span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed"><Txt k="hero.lead" kind="textarea" /></p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={href("/tools", locale)} size="lg">
              <Icon name="sparkle" className="h-5 w-5" />
              <Txt k="hero.cta1" />
            </ButtonLink>
            <ButtonLink href={href("/chat", locale)} size="lg" variant="secondary">
              <Icon name="chat" className="h-5 w-5" />
              <Txt k="hero.cta2" />
            </ButtonLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            <Badge>
              <Icon name="sparkle" className="h-3.5 w-3.5" /> <Txt k="hero.badge1" />
            </Badge>
            <Badge>
              <Icon name="heart" className="h-3.5 w-3.5" /> <Txt k="hero.badge2" />
            </Badge>
            <Badge>
              <Icon name="globe" className="h-3.5 w-3.5" /> <Txt k="hero.badge3" />
            </Badge>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <HeroCharacter />
        </div>
      </div>
    </section>
  );
}
