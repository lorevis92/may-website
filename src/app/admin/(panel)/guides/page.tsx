import Link from "next/link";
import { PageHeader } from "@/components/admin/fields";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/auth";
import { listGuideDocs } from "@/lib/content-store";

export const metadata = { title: "Guides · admin" };

export default async function AdminGuides() {
  await requireAdmin();
  const guides = await listGuideDocs();
  return (
    <>
      <PageHeader title={`Guides (${guides.length})`} intro="Free guides on the site. Visitors read a preview, then unlock the rest with their email.">
        <Link href="/admin/guides/new" className={buttonClass("primary", "md")}>
          New guide
        </Link>
      </PageHeader>
      <div className="mt-6 space-y-3">
        {guides.length === 0 && <p className="card p-6 text-ink-soft">No guides yet.</p>}
        {guides.map((g) => (
          <Link key={g.slug} href={`/admin/guides/${g.slug}`} className="card card-hover flex items-center gap-4 p-5">
            <span className="icon-tile h-11 w-11 shrink-0">
              <Icon name={g.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg text-ink">{g.en.title}</p>
              <p className="text-sm text-ink-soft" lang="th">
                {g.th.title}
              </p>
            </div>
            <p className="hidden text-right text-xs text-ink-muted sm:block">
              /{g.slug}
              <br />#{g.order} · updated {g.updated}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
