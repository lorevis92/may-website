import Link from "next/link";
import { PageHeader } from "@/components/admin/fields";
import { buttonClass } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { listDiaryDocs } from "@/lib/content-store";

export const metadata = { title: "Diary · admin" };

export default async function AdminDiary() {
  await requireAdmin();
  const entries = await listDiaryDocs();
  return (
    <>
      <PageHeader title={`Diary (${entries.length})`} intro="Short personal entries, newest first.">
        <Link href="/admin/diary/new" className={buttonClass("primary", "md")}>
          New entry
        </Link>
      </PageHeader>
      <div className="mt-6 space-y-3">
        {entries.length === 0 && <p className="card p-6 text-ink-soft">No diary entries yet.</p>}
        {entries.map((d) => (
          <Link key={d.slug} href={`/admin/diary/${d.slug}`} className="card card-hover flex items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg text-ink">{d.en.title}</p>
              <p className="text-sm text-ink-soft" lang="th">
                {d.th.title}
              </p>
            </div>
            <p className="hidden text-right text-xs text-ink-muted sm:block">
              /{d.slug}
              <br />
              {d.date}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
