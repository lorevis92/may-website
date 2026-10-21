import Link from "next/link";
import { PageHeader } from "@/components/admin/fields";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "New guide · admin" };

export default async function NewGuide() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/guides" className="text-sm text-ink-muted hover:text-ink">
        ← All guides
      </Link>
      <div className="mt-3 mb-6">
        <PageHeader title="New guide" />
      </div>
      <GuideEditor />
    </>
  );
}
