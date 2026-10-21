import Link from "next/link";
import { saveAboutContent } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { Field, Input, MarkdownHelp, PageHeader, TextArea } from "@/components/admin/fields";
import { ListEditor } from "@/components/admin/ListEditor";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { ABOUT_ICONS, getAbout } from "@/lib/about-store";
import { ABOUT_BIO_CLASS } from "@/lib/about-style";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "About page · admin" };

const LANGS = [
  { key: "th", label: "ภาษาไทย" },
  { key: "en", label: "English" },
] as const;

/** Section title fields (one per language) above each list. */
function SectionTitles({ name, label, values }: { name: "howTitle" | "credTitle" | "valuesTitle"; label: string; values: Record<"th" | "en", string> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {LANGS.map(({ key, label: lang }) => (
        <Field key={key} label={`${label} · ${lang}`}>
          <Input name={`${key}.${name}`} defaultValue={values[key]} maxLength={120} lang={key} />
        </Field>
      ))}
    </div>
  );
}

export default async function AdminAbout() {
  await requireAdmin();
  const doc = await getAbout();
  const titles = (k: "howTitle" | "credTitle" | "valuesTitle") => ({ th: doc.th[k], en: doc.en[k] });

  return (
    <>
      <PageHeader title="About page" intro="The words on your About page and the About section of the home page. The layout and design stay the same; only the text changes." />

      <ActionForm action={saveAboutContent} className="mt-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {LANGS.map(({ key, label }) => (
            <fieldset key={key} lang={key} className="card space-y-4 p-6">
              <legend className="kicker float-left mb-2 w-full">{label}</legend>
              <Field label="Small heading above the title">
                <Input name={`${key}.eyebrow`} defaultValue={doc[key].eyebrow} maxLength={120} />
              </Field>
              <Field label="Title">
                <Input name={`${key}.title`} defaultValue={doc[key].title} required maxLength={200} />
              </Field>
              <Field label="Subtitle" hint="Optional line under the title. Leave empty to hide it.">
                <TextArea name={`${key}.subtitle`} defaultValue={doc[key].subtitle} rows={2} maxLength={400} />
              </Field>
            </fieldset>
          ))}
        </div>

        <MarkdownHelp />
        {LANGS.map(({ key, label }) => (
          <div key={key} className="card p-6">
            <MarkdownField name={`${key}.bio`} label={`Bio · ${label}`} lang={key} defaultValue={doc[key].bio} previewClassName={ABOUT_BIO_CLASS} height="h-[50vh]" />
            <p className="mt-2 text-xs text-ink-muted">The first two paragraphs also appear in the About section of the home page.</p>
          </div>
        ))}

        <section className="card space-y-4 p-6">
          <h2 className="text-xl font-medium">Credentials &amp; what I do</h2>
          <p className="text-sm text-ink-soft">The list with icons in the box next to your photo.</p>
          <SectionTitles name="credTitle" label="Box title" values={titles("credTitle")} />
          <ListEditor
            name="skills"
            addLabel="Add an item"
            icons={ABOUT_ICONS}
            initial={doc.skills.map((s) => ({ icon: s.icon, th: s.th, en: s.en }))}
            fields={[
              { key: "icon", label: "Icon", kind: "icon" },
              { key: "th", label: "ภาษาไทย", lang: "th" },
              { key: "en", label: "English", lang: "en" },
            ]}
          />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-xl font-medium">How working with me looks</h2>
          <p className="text-sm text-ink-soft">The numbered steps. Numbers follow the order here.</p>
          <SectionTitles name="howTitle" label="Section title" values={titles("howTitle")} />
          <ListEditor
            name="how"
            addLabel="Add a step"
            initial={doc.how.map((h) => ({ "th.title": h.th.title, "th.body": h.th.body, "en.title": h.en.title, "en.body": h.en.body }))}
            fields={[
              { key: "th.title", label: "Step · ภาษาไทย", lang: "th" },
              { key: "en.title", label: "Step · English", lang: "en" },
              { key: "th.body", label: "Description · ภาษาไทย", kind: "textarea", lang: "th" },
              { key: "en.body", label: "Description · English", kind: "textarea", lang: "en" },
            ]}
          />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-xl font-medium">What I believe</h2>
          <p className="text-sm text-ink-soft">Short lines in the note under your photo (also on the home page).</p>
          <SectionTitles name="valuesTitle" label="Section title" values={titles("valuesTitle")} />
          <ListEditor
            name="values"
            addLabel="Add a line"
            initial={doc.values.map((v) => ({ th: v.th, en: v.en }))}
            fields={[
              { key: "th", label: "ภาษาไทย", lang: "th" },
              { key: "en", label: "English", lang: "en" },
            ]}
          />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <FormFooter label="Save About page" />
          <Link href="/en/about" target="_blank" className="text-sm text-jasmine-deep underline underline-offset-2">
            View on site
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
