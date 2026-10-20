import { NextResponse } from "next/server";
import { saveLead, type LeadInput, type LeadSource } from "@/lib/leads";
import { notifyNewLead, sendGuideEmail } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { site } from "@/lib/site.config";

export const runtime = "nodejs";

const SOURCES: LeadSource[] = ["quiz", "coverage", "retirement", "tax", "education", "health-check", "guide", "chat", "book", "contact"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max = 300): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().slice(0, max);
  return s.length ? s : undefined;
}

export async function POST(req: Request) {
  if (!rateLimit(`leads:${clientIp(req)}`, { capacity: 8, refillPerSec: 0.05 })) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  // Honeypot: real users never fill this.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  const source = SOURCES.includes(body.source as LeadSource) ? (body.source as LeadSource) : null;
  const locale = body.locale === "en" ? "en" : "th";
  if (!source) return NextResponse.json({ ok: false, error: "bad_source" }, { status: 400 });

  const email = clean(body.email, 200)?.toLowerCase();
  const phone = clean(body.phone, 40);
  const line = clean(body.line, 80);
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "bad_email" }, { status: 400 });
  if (!email && !phone && !line) return NextResponse.json({ ok: false, error: "no_contact" }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ ok: false, error: "no_consent" }, { status: 400 });

  let payload: Record<string, unknown> | undefined;
  if (body.payload && typeof body.payload === "object") {
    const json = JSON.stringify(body.payload);
    if (json.length > 20_000) return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    payload = body.payload as Record<string, unknown>;
  }

  const input: LeadInput = {
    source,
    locale,
    name: clean(body.name, 120),
    email,
    phone,
    line,
    message: clean(body.message, 2000),
    payload,
    consent: true,
    page: clean(body.page, 300),
    userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? undefined,
  };

  try {
    const lead = await saveLead(input);
    // Fire-and-forget notifications; never block the visitor on email delivery.
    void notifyNewLead(lead);
    if (source === "guide" && email && typeof payload?.guideSlug === "string" && typeof payload?.guideTitle === "string") {
      void sendGuideEmail({
        to: email,
        locale,
        guideTitle: payload.guideTitle,
        guideUrl: `${site.url}/${locale}/guides/${payload.guideSlug}?unlocked=1`,
      });
    }
    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[leads] save failed", err);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
