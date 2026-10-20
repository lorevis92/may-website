import Link from "next/link";
import { getMessages, isLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { site } from "@/lib/site.config";
import { guides, diary } from "@/content";
import { Hero } from "@/components/hero/Hero";
import { Container, Section, SectionTitle } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOL_SLUGS } from "@/lib/tools";
import { GuideCard } from "@/components/ui/GuideCard";
import { Portrait } from "@/components/ui/Portrait";

const pillarIcons: Record<string, IconName> = { health: "heart", family: "shield", retirement: "sunrise", savings: "sprout", kids: "book", business: "briefcase" };
const pillarTones: Record<string, string> = {
  health: "bg-rose-soft text-rose-deep",
  family: "bg-sage-soft text-sage-deep",
  retirement: "bg-honey-soft text-[#b47f22]",
  savings: "bg-sky-soft text-[#2f6c9a]",
  kids: "bg-plum-soft text-plum",
  business: "bg-paper-2 text-ink",
};

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  const latest = diary[0];

  return (
    <>
      <Hero />

      {/* Trust strip */}
      <Container>
        <div className="card grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
          {[
            { icon: "star" as IconName, title: t.trust.aia, sub: t.trust.aiaSub, tone: "bg-rose-soft text-rose-deep" },
            { icon: "sparkle" as IconName, title: t.trust.mdrt, sub: t.trust.mdrtSub, tone: "bg-honey-soft text-[#b47f22]" },
            { icon: "lock" as IconName, title: t.trust.licensed, sub: t.trust.licensedSub, tone: "bg-sage-soft text-sage-deep" },
          ].map((it) => (
            <div key={it.title} className="flex gap-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${it.tone}`}>
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-lg leading-tight">{it.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{it.sub}</p>
              </div>
            </div>
          ))}
        </div>
        {(site.stats.yearsExperience || site.stats.familiesHelped) && (
          <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-center">
            {site.stats.yearsExperience && (
              <p>
                <span className="font-heading text-3xl font-medium text-ink">{site.stats.yearsExperience}+</span>
                <span className="ml-2 text-ink-soft">{t.trust.years}</span>
              </p>
            )}
            {site.stats.familiesHelped && (
              <p>
                <span className="font-heading text-3xl font-medium text-ink">{site.stats.familiesHelped}+</span>
                <span className="ml-2 text-ink-soft">{t.trust.families}</span>
              </p>
            )}
            <p>
              <span className="font-heading text-3xl font-medium text-ink">{site.stats.responseTime[locale]}</span>
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
              <div key={p.key} className="card card-hover p-6">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${pillarTones[p.key]}`}>
                  <Icon name={pillarIcons[p.key]} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-medium leading-snug">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">{t.pillars.more}</p>
        </Container>
      </Section>

      {/* Tools */}
      <Section className="bg-paper-2/60 border-y border-line">
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
          <div className="grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="card tape mx-auto w-full max-w-sm p-4 rotate-[-1.5deg]">
              <Portrait className="w-full" />
              <p className="mt-3 text-center font-hand text-xl">{site.name[locale]} · {site.company}</p>
            </div>
            <div>
              <SectionTitle eyebrow={t.about.eyebrow} title={t.about.title} className="mb-6" />
              <p className="text-lg leading-relaxed text-ink-soft">{t.about.p1.replace("{city}", site.contact.city[locale])}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t.about.p2}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {t.about.values.map((v) => (
                  <li key={v} className="flex gap-3 text-[15px]">
                    <Icon name="heart" className="mt-1 h-4 w-4 shrink-0 text-rose" />
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
      <Section className="bg-paper-2/60 border-y border-line">
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
              <Link href={href(`/diary/${latest.slug}`, locale)} className="card card-hover ruled block p-7 sm:p-9 rotate-[-0.5deg]">
                <p className="font-hand text-lg text-rose-deep">{t.diary.eyebrow} · {latest.dateline[locale]}</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-medium">{latest[locale].title}</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{latest[locale].excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-heading text-rose-deep">
                  {t.diary.readEntry} <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            )}
            <div className="card flex flex-col justify-between bg-ink p-7 text-white sm:p-9">
              <div>
                <p className="font-hand text-lg text-honey">{t.chat.eyebrow}</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-medium">{t.chat.title}</h3>
                <p className="mt-3 text-white/75 leading-relaxed">{t.chat.subtitle}</p>
                <ul className="mt-5 space-y-2">
                  {t.chat.suggestions.slice(0, 3).map((s) => (
                    <li key={s} className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2 text-sm">
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
