"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/client";
import { href, switchLocalePath } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
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
    <header className={cx("sticky top-0 z-50 transition-all", scrolled ? "backdrop-blur-md bg-paper/85 shadow-[0_1px_0_var(--color-line)]" : "bg-transparent")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          <Link href={href("/", locale)} className="flex items-center gap-2.5 group" aria-label={t.nav.home}>
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-rose text-white font-hand text-xl shadow-soft group-hover:rotate-[-6deg] transition-transform">
              {locale === "th" ? "ม" : "M"}
              <span aria-hidden className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-honey border-2 border-paper" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-lg font-medium text-ink">{site.name[locale]}</span>
              <span className="hidden sm:block text-[11px] uppercase tracking-[0.14em] text-ink-muted">{site.tagline[locale]}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={cx(
                  "px-3.5 py-2 rounded-full text-[15px] font-heading transition-colors",
                  isActive(l.to) ? "bg-ink text-white" : "text-ink-soft hover:text-ink hover:bg-paper-2",
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
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-heading text-ink-soft hover:text-ink hover:border-ink transition-colors"
            >
              <Icon name="globe" className="h-4 w-4" />
              {t.nav.switchTo}
            </Link>
            <Link
              href={href("/book", locale)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2 text-sm font-heading shadow-[3px_3px_0_var(--color-rose)] hover:-translate-y-0.5 transition-transform"
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
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink"
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
              className={cx("px-4 py-3 rounded-2xl font-heading text-lg", isActive(l.to) ? "bg-ink text-white" : "text-ink hover:bg-paper-2")}
            >
              {l.label}
            </Link>
          ))}
          <Link href={href("/book", locale)} className="mt-2 px-4 py-3 rounded-2xl bg-rose text-white font-heading text-lg text-center">
            {t.nav.book}
          </Link>
        </nav>
      </div>
    </header>
  );
}
