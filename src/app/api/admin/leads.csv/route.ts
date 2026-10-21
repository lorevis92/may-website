import { timingSafeEqual } from "node:crypto";
import { listLeads } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = v === undefined || v === null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const expected = process.env.ADMIN_TOKEN ?? "";
  const ok = expected && token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!ok) return new Response("Unauthorized", { status: 401 });

  const leads = await listLeads(5000);
  const header = ["createdAt", "ref", "source", "channel", "locale", "name", "email", "phone", "line", "message", "consent", "page", "payload"];
  const rows = leads.map((l) => [l.createdAt, l.ref, l.source, l.channel, l.locale, l.name, l.email, l.phone, l.line, l.message, l.consent, l.page, l.payload].map(csvCell).join(","));
  const csv = "﻿" + [header.join(","), ...rows].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
