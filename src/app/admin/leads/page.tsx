import { timingSafeEqual } from "node:crypto";
import { listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads · admin", robots: { index: false, follow: false } };

function authorised(token: string | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Minimal private inbox for May: /admin/leads?token=ADMIN_TOKEN
 * No login system by design — a long random token in the URL (bookmark it on her phone).
 */
export default async function AdminLeads({ searchParams }: { searchParams: Promise<{ token?: string; q?: string }> }) {
  const { token, q } = await searchParams;
  if (!authorised(token)) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
          <div className="card p-8 max-w-sm text-center">
            <p className="font-heading text-2xl font-medium text-jasmine-deep">Private</p>
            <p className="mt-2 text-ink-soft text-sm">Open this page with your admin link (the one with <code>?token=</code>). Set <code>ADMIN_TOKEN</code> in the environment to enable it.</p>
          </div>
      </div>
    );
  }
  const leads = await listLeads(1000);
  const filtered = q ? leads.filter((l) => JSON.stringify(l).toLowerCase().includes(q.toLowerCase())) : leads;

  return (
    <div className="min-h-screen p-4 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">May · admin</p>
              <h1 className="text-3xl font-medium">Leads ({filtered.length})</h1>
            </div>
            <div className="flex gap-2">
              <form className="flex gap-2">
                <input type="hidden" name="token" value={token} />
                <input name="q" defaultValue={q ?? ""} placeholder="search…" className="rounded-[var(--radius-control)] border border-line bg-white px-4 py-2 text-sm focus:outline-none focus:border-jasmine" />
                <button className="rounded-[var(--radius-control)] bg-jasmine px-4 py-2 text-sm text-white hover:bg-jasmine-deep">Search</button>
              </form>
              <a href={`/api/admin/leads.csv?token=${encodeURIComponent(token ?? "")}`} className="rounded-[var(--radius-control)] border border-line-strong bg-white px-4 py-2 text-sm font-heading hover:border-ink-muted">
                Download CSV
              </a>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filtered.length === 0 && <p className="card p-6 text-ink-soft">No leads yet.</p>}
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
        </div>
    </div>
  );
}
