"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui/Button";

const LINKS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/assistant", label: "Assistant" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/diary", label: "Diary" },
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
    </nav>
  );
}
