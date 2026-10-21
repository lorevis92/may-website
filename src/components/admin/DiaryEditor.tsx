import Link from "next/link";
import { deleteDiary, saveDiary } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { DeleteButton, Field, Input, MarkdownHelp, TextArea } from "@/components/admin/fields";
import type { DiaryDoc } from "@/lib/content-store";

const LANGS = [
  { key: "th", label: "ภาษาไทย" },
  { key: "en", label: "English" },
] as const;

/** Create/edit form for a diary entry. Without `doc` it creates a new one. */
export function DiaryEditor({ doc, today }: { doc?: DiaryDoc; today: string }) {
  return (
    <div className="space-y-6">
      <ActionForm action={saveDiary} className="space-y-6">
        <input type="hidden" name="isNew" value={doc ? "0" : "1"} />
        <div className="card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="URL name" hint={doc ? "Fixed, so existing links keep working." : "Lowercase, dashes between words. Can't be changed later."} className="lg:col-span-2">
            <Input name="slug" defaultValue={doc?.slug} readOnly={!!doc} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="a-rainy-tuesday" className={doc ? "bg-paper-2 text-ink-soft" : undefined} />
          </Field>
          <Field label="Date" hint="Newest entries are shown first.">
            <Input name="date" type="date" defaultValue={doc?.date ?? today} required />
          </Field>
          <Field label="Tags" hint="Comma separated.">
            <Input name="tags" defaultValue={doc?.tags.join(", ")} placeholder="family, tax" />
          </Field>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {LANGS.map(({ key, label }) => {
            const l = doc?.[key];
            return (
              <fieldset key={key} lang={key} className="card space-y-4 p-6">
                <legend className="kicker float-left mb-2 w-full">{label}</legend>
                <Field label="Dateline" hint='Small line above the title, e.g. "Bangkok, rainy evening".'>
                  <Input name={`${key}.dateline`} defaultValue={doc?.dateline[key]} maxLength={120} />
                </Field>
                <Field label="Title">
                  <Input name={`${key}.title`} defaultValue={l?.title} required maxLength={200} />
                </Field>
                <Field label="Excerpt" hint="One or two sentences for the diary list and the home page.">
                  <TextArea name={`${key}.excerpt`} defaultValue={l?.excerpt} rows={3} maxLength={600} />
                </Field>
                <Field label="Entry text">
                  <TextArea name={`${key}.body`} defaultValue={l?.body} rows={24} className="font-mono text-[14px]" />
                </Field>
              </fieldset>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <FormFooter label={doc ? "Save entry" : "Create entry"} />
          {doc && (
            <Link href={`/en/diary/${doc.slug}`} target="_blank" className="text-sm text-jasmine-deep underline underline-offset-2">
              View on site
            </Link>
          )}
        </div>
      </ActionForm>

      <MarkdownHelp />
      {doc && <DeleteButton action={deleteDiary} name="slug" value={doc.slug} label="Delete this entry" confirm="Delete this diary entry from the site for good?" />}
    </div>
  );
}
