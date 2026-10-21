import Link from "next/link";
import { DiaryEditor } from "@/components/admin/DiaryEditor";
import { PageHeader } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "New diary entry · admin" };

export default async function NewDiaryEntry() {
  await requireAdmin();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
  return (
    <>
      <Link href="/admin/diary" className="text-sm text-ink-muted hover:text-ink">
        ← All entries
      </Link>
      <div className="mt-3 mb-6">
        <PageHeader title="New diary entry" />
      </div>
      <DiaryEditor today={today} />
    </>
  );
}
