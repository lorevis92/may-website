import Link from "next/link";
import { deleteGuide, saveGuide } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { DeleteButton, Field, Input, MarkdownHelp, Select, TextArea } from "@/components/admin/fields";
import { getMessages } from "@/i18n";
import type { GuideDoc } from "@/lib/content-store";
import { TOOL_SLUGS, toolMessageKey } from "@/lib/tools";

const ICONS = ["book", "shield", "heart", "sunrise", "receipt", "sprout"] as const;
const LANGS = [
  { key: "th", label: "ภาษาไทย" },
  { key: "en", label: "English" },
] as const;

/** Create/edit form for a guide. Without `doc` it creates a new one. */
export function GuideEditor({ doc }: { doc?: GuideDoc }) {
  const en = getMessages("en");
  return (
    <div className="space-y-6">
      <ActionForm action={saveGuide} className="space-y-6">
        <input type="hidden" name="isNew" value={doc ? "0" : "1"} />
        <div className="card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="URL name" hint={doc ? "Fixed, so existing links keep working." : "Lowercase, dashes between words. Can't be changed later."} className="lg:col-span-2">
            <Input name="slug" defaultValue={doc?.slug} readOnly={!!doc} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="health-for-parents" className={doc ? "bg-paper-2 text-ink-soft" : undefined} />
          </Field>
          <Field label="Icon">
            <Select name="icon" defaultValue={doc?.icon ?? "book"}>
              {ICONS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </Select>
          </Field>
          <Field label="Position in the list" hint="Lower numbers come first.">
            <Input name="order" type="number" min={0} max={999} defaultValue={doc?.order ?? 10} />
          </Field>
          <Field label="Related free tool" className="sm:col-span-2">
            <Select name="relatedTool" defaultValue={doc?.relatedTool ?? ""}>
              <option value="">None</option>
              {TOOL_SLUGS.map((s) => (
                <option key={s} value={s}>
                  {en.tools[toolMessageKey[s]].name}
                </option>
              ))}
            </Select>
          </Field>
          {doc && <p className="self-end pb-3 text-sm text-ink-muted sm:col-span-2">Last updated {doc.updated}. Saving sets it to today.</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {LANGS.map(({ key, label }) => {
            const l = doc?.[key];
            return (
              <fieldset key={key} lang={key} className="card space-y-4 p-6">
                <legend className="kicker float-left mb-2 w-full">{label}</legend>
                <Field label="Title">
                  <Input name={`${key}.title`} defaultValue={l?.title} required maxLength={200} />
                </Field>
                <Field label="Subtitle">
                  <TextArea name={`${key}.subtitle`} defaultValue={l?.subtitle} rows={2} maxLength={400} />
                </Field>
                <Field label="Reading time (minutes)">
                  <Input name={`${key}.readingMinutes`} type="number" min={1} max={60} defaultValue={l?.readingMinutes ?? 5} className="w-32" />
                </Field>
                <Field label="Key takeaways" hint="One per line, 3–5 short lines. Shown at the top, before the email gate.">
                  <TextArea name={`${key}.summary`} defaultValue={l?.summary.join("\n")} rows={5} />
                </Field>
                <Field label="Guide text" hint="The first few blocks are the free preview; the rest unlocks after the email.">
                  <TextArea name={`${key}.body`} defaultValue={l?.body} rows={26} className="font-mono text-[14px]" />
                </Field>
              </fieldset>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <FormFooter label={doc ? "Save guide" : "Create guide"} />
          {doc && (
            <Link href={`/en/guides/${doc.slug}`} target="_blank" className="text-sm text-jasmine-deep underline underline-offset-2">
              View on site
            </Link>
          )}
        </div>
      </ActionForm>

      <MarkdownHelp />
      {doc && <DeleteButton action={deleteGuide} name="slug" value={doc.slug} label="Delete this guide" confirm="Delete this guide from the site for good?" />}
    </div>
  );
}
