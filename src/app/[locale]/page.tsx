import Link from "next/link";
import { getMessages, isLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { site } from "@/lib/site.config";
import { listDiary, listGuides } from "@/lib/content-store";
import { Hero } from "@/components/hero/Hero";
import { Container, Section, SectionTitle } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOL_SLUGS } from "@/lib/tools";
import { GuideCard } from "@/components/ui/GuideCard";
import { Portrait } from "@/components/ui/Portrait";

const pillarIcons: Record<string, IconName> = { health: "heart", family: "shield", retirement: "sunrise", savings: "sprout", kids: "book", business: "briefcase" };

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  const [guides, diary] = await Promise.all([listGuides(), listDiary()]);
  const latest = diary[0];

  return (
    <>
      <Hero />

      {/* Trust strip */}
      <Container>
        <div className="card grid gap-6 p-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line sm:p-0">
          {[
            { icon: "star" as IconName, title: t.trust.aia, sub: t.trust.aiaSub },
            { icon: "sparkle" as IconName, title: t.trust.mdrt, sub: t.trust.mdrtSub },
            { icon: "lock" as IconName, title: t.trust.licensed, sub: t.trust.licensedSub },
          ].map((it) => (
            <div key={it.title} className="flex gap-4 sm:p-7">
              <span className="icon-tile h-10 w-10 shrink-0">
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-[17px] font-medium leading-tight">{it.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{it.sub}</p>
              </div>
            </div>
          ))}
        </div>
        {(site.stats.yearsExperience || site.stats.familiesHelped) && (
          <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-3 text-center">
            {site.stats.yearsExperience && (
              <p>
                <span className="font-heading text-3xl font-medium tracking-[-0.02em] text-jasmine-deep">{site.stats.yearsExperience}+</span>
                <span className="ml-2 text-ink-soft">{t.trust.years}</span>
              </p>
            )}
            {site.stats.familiesHelped && (
              <p>
                <span className="font-heading text-3xl font-medium tracking-[-0.02em] text-jasmine-deep">{site.stats.familiesHelped}+</span>
                <span className="ml-2 text-ink-soft">{t.trust.families}</span>
              </p>
            )}
            <p>
              <span className="font-heading text-3xl font-medium tracking-[-0.02em] text-jasmine-deep">{site.stats.responseTime[locale]}</span>
              <span className="ml-2 text-ink-soft">{t.trust.reply}</span>
            </p>
          </div>
        )}
      </Container>

      {/* Pillars */}
      <Section>
        <Container>
          <SectionTitle eyebrow={t.pillars.eyebrow} title={t.pillars.title} subtitle={t.pillars.subtitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.pillars.items.map((p) => (
              <div key={p.key} className="card p-6">
                <span className="icon-tile h-11 w-11">
                  <Icon name={pillarIcons[p.key]} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-medium leading-snug">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">{t.pillars.more}</p>
        </Container>
      </Section>

      {/* Tools */}
      <Section className="bg-paper-2/50 border-y border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow={t.toolsSection.eyebrow} title={t.toolsSection.title} subtitle={t.toolsSection.subtitle} className="mb-0" />
            <ButtonLink href={href("/tools", locale)} variant="secondary" className="mb-2">
              {t.toolsSection.allTools} <Icon name="arrow" className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_SLUGS.map((slug, i) => (
              <ToolCard key={slug} slug={slug} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* About teaser */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="card mx-auto w-full max-w-sm p-3">
              <Portrait className="w-full" />
              <p className="px-2 pb-1 pt-3 text-center font-heading text-sm text-ink-soft">{site.name[locale]} · {site.company}</p>
            </div>
            <div>
              <SectionTitle eyebrow={t.about.eyebrow} title={t.about.title} className="mb-6" />
              <p className="text-lg leading-relaxed text-ink-soft">{t.about.p1.replace("{city}", site.contact.city[locale])}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t.about.p2}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {t.about.values.map((v) => (
                  <li key={v} className="flex gap-3 text-[15px]">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-jasmine" />
                    {v}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={href("/about", locale)} variant="secondary">
                  {t.nav.about} <Icon name="arrow" className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href={href("/book", locale)}>
                  <Icon name="pen" className="h-4 w-4" /> {t.nav.book}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Guides */}
      <Section className="bg-paper-2/50 border-y border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow={t.guides.eyebrow} title={t.guides.title} subtitle={t.guides.subtitle} className="mb-0" />
            <ButtonLink href={href("/guides", locale)} variant="secondary" className="mb-2">
              {t.guides.allGuides} <Icon name="arrow" className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} locale={locale} t={t} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Diary + chat */}
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {latest && (
              <Link href={href(`/diary/${latest.slug}`, locale)} className="card card-hover block p-7 sm:p-9">
                <p className="kicker">{t.diary.eyebrow} · {latest.dateline[locale]}</p>
                <h3 className="mt-4 text-2xl sm:text-[2rem] font-medium text-jasmine-ink">{latest[locale].title}</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{latest[locale].excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-medium text-jasmine-deep">
                  {t.diary.readEntry} <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            )}
            <div className="card flex flex-col justify-between border-ink bg-ink p-7 text-white sm:p-9">
              <div>
                <p className="kicker text-jasmine-bright">{t.chat.eyebrow}</p>
                <h3 className="mt-4 text-2xl sm:text-[2rem] font-medium">{t.chat.title}</h3>
                <p className="mt-3 text-white/75 leading-relaxed">{t.chat.subtitle}</p>
                <ul className="mt-5 space-y-2">
                  {t.chat.suggestions.slice(0, 3).map((s) => (
                    <li key={s} className="rounded-xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/85">
                      “{s}”
                    </li>
                  ))}
                </ul>
              </div>
              <ButtonLink href={href("/chat", locale)} variant="secondary" className="mt-6 self-start">
                <Icon name="chat" className="h-5 w-5" /> {t.hero.cta2}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
