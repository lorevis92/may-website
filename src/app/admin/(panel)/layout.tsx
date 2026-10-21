import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth";

/**
 * Shell for every signed-in admin page. The check here only avoids rendering the shell for
 * visitors; each page and server action still calls requireAdmin() itself.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8">
          <Link href="/admin/leads" className="flex items-center gap-2.5">
            <Logo className="h-9" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Admin</span>
          </Link>
          <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
            <AdminNav />
          </div>
          <div className="ml-auto flex items-center gap-4 sm:ml-0">
            <Link href="/" target="_blank" className="text-sm text-ink-soft hover:text-ink">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm font-heading text-ink-soft hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
