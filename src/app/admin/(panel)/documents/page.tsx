import { removeDocument, toggleDocument, uploadDocument } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { DeleteButton, Field, Input, PageHeader } from "@/components/admin/fields";
import { cx } from "@/components/ui/Button";
import { listDocuments } from "@/lib/assistant-store";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Documents · admin" };

/** Above this, every chat message carries a lot of text: slower and more expensive. */
const LARGE_CONTEXT_CHARS = 60_000;

export default async function AdminDocuments() {
  await requireAdmin();
  const docs = await listDocuments();
  const activeChars = docs.filter((d) => d.active).reduce((n, d) => n + d.chars, 0);

  return (
    <>
      <PageHeader
        title="Documents"
        intro="Upload a PDF or TXT (a recent post, a product update, an FAQ). The text of every active document is given to the chat assistant in full, so it can answer about it."
      />

      <ActionForm action={uploadDocument} resetOnSuccess className="card mt-6 grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Title">
          <Input name="title" maxLength={200} placeholder="e.g. Facebook post: tax season tips" />
        </Field>
        <Field label="File (PDF or TXT, max 4 MB)">
          <Input name="file" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain" required className="py-2.5 file:mr-3 file:rounded-md file:border-0 file:bg-jasmine-mist file:px-3 file:py-1 file:font-heading file:text-jasmine-deep" />
        </Field>
        <FormFooter label="Upload" pendingLabel="Reading file…" className="sm:col-span-3" />
      </ActionForm>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-medium">Your documents ({docs.length})</h2>
        <p className={cx("text-sm", activeChars > LARGE_CONTEXT_CHARS ? "text-clay" : "text-ink-muted")}>
          Active text: {activeChars.toLocaleString("en")} characters
          {activeChars > LARGE_CONTEXT_CHARS && " · that's a lot for every chat message; consider turning older ones off"}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {docs.length === 0 && <p className="card p-6 text-ink-soft">No documents yet.</p>}
        {docs.map((d) => (
          <div key={d.id} className={cx("card flex flex-wrap items-center gap-x-6 gap-y-3 p-5", !d.active && "opacity-70")}>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg text-ink">{d.title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {d.filename ?? "—"} · {d.chars.toLocaleString("en")} characters · {new Date(d.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Bangkok" })}
                {d.truncated && <span className="text-clay"> · cut to the first 100,000 characters</span>}
              </p>
            </div>
            <form action={toggleDocument}>
              <input type="hidden" name="id" value={d.id} />
              <input type="hidden" name="active" value={d.active ? "0" : "1"} />
              <button
                type="submit"
                className={cx(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-heading transition-colors",
                  d.active ? "bg-jasmine-mist text-jasmine-deep hover:bg-jasmine-soft" : "bg-paper-2 text-ink-muted hover:text-ink",
                )}
                aria-label={d.active ? `Turn off ${d.title}` : `Turn on ${d.title}`}
              >
                <span className={cx("h-2 w-2 rounded-full", d.active ? "bg-jasmine" : "bg-ink-muted/50")} />
                {d.active ? "Active" : "Off"}
              </button>
            </form>
            <DeleteButton action={removeDocument} name="id" value={d.id} confirm="Delete this document for good?" />
          </div>
        ))}
      </div>
    </>
  );
}
