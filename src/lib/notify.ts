import "server-only";
import type { Lead } from "./leads";
import { site } from "./site.config";

/**
 * Email notifications via Resend (https://resend.com — free tier is plenty).
 * Set RESEND_API_KEY and NOTIFY_EMAIL (where May receives leads) and FROM_EMAIL (a verified sender).
 * Without them, notifications are skipped silently and leads are still stored.
 */
const labels: Record<Lead["source"], string> = {
  quiz: "Life-stage quiz",
  coverage: "Family protection calculator",
  retirement: "Retirement planner",
  tax: "Tax-room calculator",
  education: "Education planner",
  "health-check": "Health cover check-up",
  guide: "Guide unlock",
  chat: "Chat handoff",
  book: "Booking request",
  contact: "Contact",
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

function renderPayload(payload?: Record<string, unknown>): string {
  if (!payload) return "";
  const rows = Object.entries(payload)
    .map(([k, v]) => {
      const val = typeof v === "object" ? `<pre style="white-space:pre-wrap;margin:0">${escapeHtml(JSON.stringify(v, null, 2))}</pre>` : escapeHtml(String(v));
      return `<tr><td style="padding:4px 10px 4px 0;color:#8a7e83;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0">${val}</td></tr>`;
    })
    .join("");
  return `<table style="font-size:13px;border-collapse:collapse;margin-top:12px">${rows}</table>`;
}

export async function notifyNewLead(lead: Lead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.FROM_EMAIL ?? "May website <onboarding@resend.dev>";
  if (!key || !to) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const subject = `New lead · ${labels[lead.source]}${lead.channel === "line" ? " · via LINE" : ""} · ${lead.ref}${lead.name ? ` · ${lead.name}` : ""}`;
    const contact = [
      lead.name && `<b>Name:</b> ${escapeHtml(lead.name)}`,
      lead.email && `<b>Email:</b> ${escapeHtml(lead.email)}`,
      lead.phone && `<b>Phone:</b> ${escapeHtml(lead.phone)}`,
      lead.line && `<b>LINE:</b> ${escapeHtml(lead.line)}`,
      lead.message && `<b>Message:</b> ${escapeHtml(lead.message)}`,
    ]
      .filter(Boolean)
      .join("<br/>");
    await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#2a2024">
        <p style="margin:0 0 8px"><b>${labels[lead.source]}</b> · ${lead.locale.toUpperCase()} · ${new Date(lead.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Bangkok" })} (Bangkok)</p>
        <p style="margin:0 0 8px">${contact || (lead.channel === "line" ? `<i>Opened LINE with reference <b>${escapeHtml(lead.ref)}</b>. Watch for their message.</i>` : "<i>No contact details left</i>")}</p>
        ${renderPayload(lead.payload)}
        <p style="margin-top:16px;font-size:12px;color:#8a7e83">Consent: ${lead.consent ? "yes" : "no"} · Page: ${escapeHtml(lead.page ?? "-")}</p>
      </div>`,
    });
  } catch (err) {
    console.error("[notify] failed", err);
  }
}

/** Optional: send the visitor the guide they unlocked (PDF link = print view of the guide). */
export async function sendGuideEmail(opts: { to: string; locale: "th" | "en"; guideTitle: string; guideUrl: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!key || !from) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const th = opts.locale === "th";
    await resend.emails.send({
      from,
      to: opts.to,
      subject: th ? `คู่มือของคุณจากเมย์: ${opts.guideTitle}` : `Your guide from May: ${opts.guideTitle}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#2a2024">
        <p>${th ? "สวัสดีค่ะ" : "Hello!"}</p>
        <p>${th ? "ขอบคุณที่สนใจนะคะ นี่คือลิงก์คู่มือฉบับเต็ม เปิดอ่านได้เลย หรือกด 'พิมพ์ / บันทึกเป็น PDF' ในหน้านั้นเพื่อเก็บไว้ค่ะ" : "Thank you for your interest. Here is your full guide. Open it any time, or use 'Print / save as PDF' on the page to keep a copy."}</p>
        <p><a href="${opts.guideUrl}" style="display:inline-block;background:#2a2024;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">${escapeHtml(opts.guideTitle)}</a></p>
        <p>${th ? "ถ้ามีคำถามหรืออยากคุยเรื่องสถานการณ์ของคุณ ทักเมย์ได้เลยนะคะ" : "If you have questions or would like to talk about your own situation, just reply to this email."}</p>
        <p>— ${th ? "เมย์" : "May"}${site.contact.lineId ? ` · LINE ${site.contact.lineId}` : ""}</p>
      </div>`,
    });
  } catch (err) {
    console.error("[notify] guide email failed", err);
  }
}
