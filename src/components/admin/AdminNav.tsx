"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { editSite } from "@/app/admin/actions";
import { cx } from "@/components/ui/Button";

const LINKS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/assistant", label: "Assistant" },
  { href: "/admin/documents", label: "Documents" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto" aria-label="Admin">
      {LINKS.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cx(
              "shrink-0 rounded-[var(--radius-control)] px-3.5 py-2 text-[15px] font-heading transition-colors",
              active ? "bg-jasmine-mist text-jasmine-deep" : "text-ink-soft hover:bg-paper-2 hover:text-ink",
            )}
          >
            {l.label}
          </Link>
        );
      })}
      {/* About, guides, diary and the site's wording are edited in place on the pages themselves. */}
      <form action={editSite} className="shrink-0">
        <button type="submit" className="rounded-[var(--radius-control)] px-3.5 py-2 text-[15px] font-heading text-jasmine-deep transition-colors hover:bg-jasmine-mist">
          Edit the site ↗
        </button>
      </form>
    </nav>
  );
}
