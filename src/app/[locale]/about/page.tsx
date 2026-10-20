import type { Metadata } from "next";
import { getMessages, isLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { site } from "@/lib/site.config";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Portrait } from "@/components/ui/Portrait";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : "th");
  return { title: t.nav.about, description: t.about.p2 };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "th";
  const t = getMessages(locale);
  const a = t.about;

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight">{a.title}</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>{a.p1.replace("{city}", site.contact.city[locale])}</p>
            <p>{a.p2}</p>
            <p>{a.p3}</p>
          </div>

          <h2 className="mt-12 text-2xl font-medium">{a.howTitle}</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {a.how.map((h, i) => (
              <li key={h.t} className="card p-5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-rose text-white font-heading text-sm">{i + 1}</span>
                <p className="mt-3 font-heading text-lg">{h.t}</p>
                <p className="mt-1 text-[15px] text-ink-soft">{h.b}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={href("/book", locale)} size="lg">
              <Icon name="pen" className="h-5 w-5" /> {a.cta}
            </ButtonLink>
            {site.contact.lineUrl && (
              <ButtonLink href={site.contact.lineUrl} size="lg" variant="line">
                <Icon name="line" className="h-5 w-5" /> LINE {site.contact.lineId}
              </ButtonLink>
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="card tape p-5">
            <Portrait className="w-full" />
            <p className="mt-3 text-center font-hand text-xl">{site.name[locale]} · {site.company}</p>
          </div>
          <div className="card p-6">
            <h3 className="font-heading text-sm uppercase tracking-[0.12em] text-ink-muted">{a.credTitle}</h3>
            <ul className="mt-3 space-y-2.5">
              {a.cred.map((c) => (
                <li key={c} className="flex gap-3 text-[15px]">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-sage-deep" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="sticker bg-white">AIA</span>
              <span className="sticker bg-honey-soft">MDRT</span>
              <span className="sticker bg-sage-soft">IC License</span>
            </div>
          </div>
          <div className="note">
            <p className="mb-2 text-sm font-heading uppercase tracking-[0.12em] text-[#b47f22]">{a.valuesTitle}</p>
            <ul className="space-y-1.5">
              {a.values.map((v) => (
                <li key={v}>♡ {v}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}
