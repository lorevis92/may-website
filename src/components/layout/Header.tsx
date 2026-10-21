"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/client";
import { href, switchLocalePath } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { cx } from "@/components/ui/Button";
import { site } from "@/lib/site.config";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Header() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 12, () => false);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const links = [
    { to: href("/tools", locale), label: t.nav.tools },
    { to: href("/guides", locale), label: t.nav.guides },
    { to: href("/diary", locale), label: t.nav.diary },
    { to: href("/about", locale), label: t.nav.about },
    { to: href("/chat", locale), label: t.nav.chat },
  ];
  const otherLocale = locale === "th" ? "en" : "th";
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className={cx("sticky top-0 z-50 transition-all", scrolled ? "backdrop-blur-md bg-paper/85 shadow-[0_1px_0_var(--color-line)]" : "bg-transparent shadow-[0_1px_0_transparent]")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          <Link href={href("/", locale)} className="flex items-center gap-2.5 group" aria-label={t.nav.home}>
            <Logo className="h-9 sm:h-11 transition-opacity group-hover:opacity-80" priority />
            <span className="hidden sm:block text-[11px] leading-tight uppercase tracking-[0.12em] text-ink-muted">{site.tagline[locale]}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={cx(
                  "relative px-3.5 py-2 text-[15px] font-heading transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:transition-colors",
                  isActive(l.to) ? "text-jasmine-deep after:bg-jasmine" : "text-ink-soft hover:text-ink after:bg-transparent",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={switchLocalePath(pathname, otherLocale)}
              hrefLang={otherLocale}
              aria-label={t.nav.switchAria}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-line bg-white px-3 py-2 text-sm font-heading text-ink-soft hover:text-ink hover:border-line-strong transition-colors"
            >
              <Icon name="globe" className="h-4 w-4" />
              {t.nav.switchTo}
            </Link>
            <Link
              href={href("/book", locale)}
              className="hidden sm:inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-jasmine text-white px-4 py-2 text-sm font-heading font-medium shadow-[0_1px_2px_rgba(10,58,57,0.18)] hover:bg-jasmine-deep transition-colors"
            >
              <Icon name="pen" className="h-4 w-4" />
              {t.nav.book}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-[var(--radius-control)] border border-line bg-white text-ink"
            >
              <Icon name={open ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cx(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 border-b border-line bg-paper",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col gap-1" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cx("px-4 py-3 rounded-[var(--radius-control)] font-heading text-lg", isActive(l.to) ? "bg-jasmine-mist text-jasmine-deep" : "text-ink hover:bg-paper-2")}
            >
              {l.label}
            </Link>
          ))}
          <Link href={href("/book", locale)} className="mt-2 px-4 py-3 rounded-[var(--radius-control)] bg-jasmine text-white font-heading text-lg text-center">
            {t.nav.book}
          </Link>
        </nav>
      </div>
    </header>
  );
}
