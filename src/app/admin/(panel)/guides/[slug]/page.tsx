import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/fields";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { requireAdmin } from "@/lib/auth";
import { getGuideDoc } from "@/lib/content-store";

export const metadata = { title: "Edit guide · admin" };

export default async function EditGuide({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const doc = await getGuideDoc(slug);
  if (!doc) notFound();
  return (
    <>
      <Link href="/admin/guides" className="text-sm text-ink-muted hover:text-ink">
        ← All guides
      </Link>
      <div className="mt-3 mb-6">
        <PageHeader title={doc.en.title} />
      </div>
      <GuideEditor doc={doc} />
    </>
  );
}
