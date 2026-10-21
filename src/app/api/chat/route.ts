import { mayPersona } from "@/lib/may-persona";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MODEL = process.env.CHAT_MODEL ?? "claude-sonnet-5-5";
const MAX_TURNS = 24;
const MAX_CHARS = 2000;

/**
 * Streams a reply from Claude in May's voice as plain text chunks.
 * The client appends chunks as they arrive. Errors come back as JSON with a status code.
 */
export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, { capacity: 20, refillPerSec: 0.2 })) {
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
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "no_message" }, { status: 400 });
  }
  // Anthropic requires alternating roles starting with "user"; drop any leading assistant intro.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.messages.stream({
          model: MODEL,
          max_tokens: 700,
          temperature: 0.7,
          system: [{ type: "text", text: mayPersona(locale), cache_control: { type: "ephemeral" } }],
          messages,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("[chat] stream failed", err);
        controller.enqueue(encoder.encode(locale === "th" ? "\n\n(ขออภัยค่ะ มีปัญหาในการเชื่อมต่อ ลองอีกครั้งนะคะ)" : "\n\n(Sorry, connection hiccup. Please try again.)"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
