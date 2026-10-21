import Link from "next/link";
import { saveNotes } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { PageHeader, TextArea } from "@/components/admin/fields";
import { getAssistantNotes, MAX_NOTES_CHARS } from "@/lib/assistant-store";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Assistant · admin" };

export default async function AdminAssistant() {
  await requireAdmin();
  const notes = await getAssistantNotes();
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <PageHeader
          title="Notes for your assistant"
          intro="Anything you'd like the chat assistant to know or do right now: tone, what to mention, news, things to avoid. Write it like a note to a colleague, in Thai or English."
        />
        <ActionForm action={saveNotes} className="mt-6 space-y-4">
          <TextArea
            name="notes"
            defaultValue={notes}
            rows={18}
            maxLength={MAX_NOTES_CHARS}
            placeholder={"e.g.\n- This month many people ask about tax before December. Mention the Tax-room calculator.\n- I'm away 10–14 Nov, replies may be slower.\n- Keep answers extra short on mobile."}
          />
          <FormFooter label="Save notes" />
        </ActionForm>
      </div>
      <aside className="card space-y-3 p-6 text-sm leading-relaxed text-ink-soft">
        <p className="kicker">How it works</p>
        <p>Your notes are added after the assistant&apos;s built-in instructions. They add to them, they don&apos;t replace them.</p>
        <p>
          The safety rules always stay on: no premiums, benefit amounts or returns for a specific product, no guaranteed returns, the fixed tax figures, and never asking for ID, bank or medical details. If a note conflicts with
          them, the assistant follows the rules.
        </p>
        <p>
          For longer material (a post, a product update), upload it under{" "}
          <Link href="/admin/documents" className="text-jasmine-deep underline underline-offset-2">
            Documents
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
