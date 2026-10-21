import Link from "next/link";
import { notFound } from "next/navigation";
import { DiaryEditor } from "@/components/admin/DiaryEditor";
import { PageHeader } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth";
import { getDiaryDoc } from "@/lib/content-store";

export const metadata = { title: "Edit diary entry · admin" };

export default async function EditDiaryEntry({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const doc = await getDiaryDoc(slug);
  if (!doc) notFound();
  return (
    <>
      <Link href="/admin/diary" className="text-sm text-ink-muted hover:text-ink">
        ← All entries
      </Link>
      <div className="mt-3 mb-6">
        <PageHeader title={doc.en.title} />
      </div>
      <DiaryEditor doc={doc} today={doc.date} />
    </>
  );
}
