import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MODEL = process.env.CHAT_MODEL ?? "claude-sonnet-5-5";
const MAX_TURNS = 24;
const MAX_CHARS = 1500;

const SYSTEM = {
  en: "Write in English.",
  th: "Write in Thai, without polite ending particles (ครับ/ค่ะ), since the visitor's gender is unknown.",
} as const;

/**
 * One- or two-sentence recap of a "Chat with May" conversation, written as the visitor, for the
 * prefilled LINE message ("I asked about …"). The full transcript stays on the lead in /admin/leads.
 */
export async function POST(req: Request) {
  if (!rateLimit(`chat-summary:${clientIp(req)}`, { capacity: 10, refillPerSec: 0.1 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "no_api_key" }, { status: 503 });

  let body: { messages?: ChatMessage[]; locale?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "th";
  const transcript = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content.slice(0, MAX_CHARS)}`)
    .join("\n\n");
  if (!transcript.includes("Visitor:")) return Response.json({ error: "no_message" }, { status: 400 });

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      output_config: { effort: "low" },
      system:
        "You recap a website chat between a visitor and the AI assistant of May, an insurance and financial advisor in Thailand. " +
        "Write one or two short sentences in the first person, as the visitor telling May what they talked about, " +
        'e.g. "I asked about health cover for my parents and how copay plans work." ' +
        "Cover the main topics of the whole conversation, not just the last question. At most 200 characters. " +
        "Plain text only: no lists, markdown, quotes or greeting. Leave out names, phone numbers, ID numbers, exact amounts and medical details. " +
        SYSTEM[locale],
      messages: [{ role: "user", content: `<chat>\n${transcript}\n</chat>` }],
    });
    const text = res.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (res.stop_reason === "refusal" || !text) return Response.json({ error: "no_summary" }, { status: 502 });
    return Response.json({ summary: text.slice(0, 280) }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[chat-summary] failed", err);
    return Response.json({ error: "failed" }, { status: 502 });
  }
}
