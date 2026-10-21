import { PageHeader } from "@/components/admin/fields";
import { buttonClass } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/leads";

export const metadata = { title: "Leads · admin" };

/** May's inbox: every form, tool, guide, booking and LINE lead, newest first. Search matches any field, including the LINE ref code. */
export default async function AdminLeads({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q } = await searchParams;
  const leads = await listLeads(1000);
  const filtered = q ? leads.filter((l) => JSON.stringify(l).toLowerCase().includes(q.toLowerCase())) : leads;

  return (
    <>
      <PageHeader title={`Leads (${filtered.length})`}>
        <div className="flex flex-wrap gap-2">
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search, or a LINE ref code…"
              className="w-56 rounded-[var(--radius-control)] border border-line bg-white px-4 py-2 text-sm focus:outline-none focus:border-jasmine"
            />
            <button className={buttonClass("primary", "sm")}>Search</button>
          </form>
          <a href="/api/admin/leads.csv" className={buttonClass("secondary", "sm")}>
            Download CSV
          </a>
        </div>
      </PageHeader>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && <p className="card p-6 text-ink-soft">{q ? "No leads match that search." : "No leads yet."}</p>}
        {filtered.map((l) => (
          <details key={l.id} className="card p-5">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1">
              <span className="rounded-full bg-jasmine-mist px-2.5 py-0.5 text-xs font-heading text-jasmine-deep">{l.source}</span>
              {l.ref && <span className="font-mono text-sm tracking-wider text-ink">{l.ref}</span>}
              {l.channel === "line" && <span className="rounded-full bg-[#06C755]/10 px-2.5 py-0.5 text-xs font-heading text-[#05a346]">via LINE</span>}
              <span className="text-xs uppercase text-ink-muted">{l.locale}</span>
              <span className="font-heading">{l.name ?? "—"}</span>
              <span className="text-sm text-ink-soft">{[l.email, l.line, l.phone].filter(Boolean).join(" · ") || "no contact"}</span>
              <span className="ml-auto text-xs text-ink-muted">{new Date(l.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Bangkok" })}</span>
            </summary>
            {l.message && <p className="mt-3 whitespace-pre-wrap text-[15px]">{l.message}</p>}
            {l.payload && <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-paper-2 p-4 text-xs">{JSON.stringify(l.payload, null, 2)}</pre>}
            <p className="mt-3 text-xs text-ink-muted">
              consent: {l.consent ? "yes" : "no"} · page: {l.page ?? "—"} · id: {l.id}
            </p>
          </details>
        ))}
      </div>
    </>
  );
}
