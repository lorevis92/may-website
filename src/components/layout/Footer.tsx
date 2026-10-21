"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { site } from "@/lib/site.config";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const { locale, t } = useI18n();
  const year = new Date().getFullYear();
  const c = site.contact;
  const cred = site.credentials;

  return (
    <footer className="mt-24 border-t border-line bg-paper-2/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-11" />
            <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-md">{t.footer.about}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge">AIA</span>
              {cred.mdrt && <span className="badge">MDRT{cred.mdrtYears.length ? ` ${cred.mdrtYears.join(" · ")}` : ""}</span>}
              <span className="badge">IC</span>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{t.footer.quick}</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              {[
                [href("/tools", locale), t.nav.tools],
                [href("/guides", locale), t.nav.guides],
                [href("/diary", locale), t.nav.diary],
                [href("/about", locale), t.nav.about],
                [href("/chat", locale), t.nav.chat],
                [href("/book", locale), t.nav.book],
                [href("/privacy", locale), t.footer.legal],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link href={to} className="text-ink-soft transition-colors hover:text-jasmine-deep">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{t.footer.contact}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {c.lineId && (
                <li>
                  <a href={c.lineUrl || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                    <Icon name="line" className="h-4 w-4 text-[#06C755]" /> LINE {c.lineId}
                  </a>
                </li>
              )}
              {c.phone && (
                <li>
                  <a href={c.phoneHref} className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                    <Icon name="phone" className="h-4 w-4" /> {c.phone}
                  </a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                    <Icon name="mail" className="h-4 w-4" /> {c.email}
                  </a>
                </li>
              )}
            </ul>
            <h3 className="mt-6 font-heading text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{t.footer.licences}</h3>
            <ul className="mt-3 space-y-1 text-xs text-ink-muted">
              {cred.agentLicenseNo && <li>{t.footer.agentLicence} {cred.agentLicenseNo}</li>}
              {cred.icLicenseNo && <li>{t.footer.icLicence} {cred.icLicenseNo}</li>}
              {cred.nonLifeLicenseNo && <li>{t.footer.nonLife} {cred.nonLifeLicenseNo}</li>}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-muted leading-relaxed">{t.footer.disclaimer}</p>
        <p className="mt-3 text-xs text-ink-muted">
          © {year} {site.fullName[locale]}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
