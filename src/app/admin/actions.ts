"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { addDocument, deleteDocument, MAX_DOC_CHARS, saveAssistantNotes, setDocumentActive } from "@/lib/assistant-store";
import { adminConfigured, checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  deleteDiaryDoc,
  deleteGuideDoc,
  getDiaryDoc,
  getGuideDoc,
  saveDiaryDoc,
  saveGuideDoc,
  type DiaryDoc,
  type DiaryLocaleDoc,
  type GuideDoc,
  type GuideLocaleDoc,
} from "@/lib/content-store";
import { rateLimit } from "@/lib/ratelimit";
import { TOOL_SLUGS, type ToolSlug } from "@/lib/tools";

/** Result shown under an admin form (see components/admin/ActionForm). */
export type ActionState = { ok: boolean; message: string } | null;

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const GUIDE_ICONS = ["shield", "sunrise", "receipt", "sprout", "heart", "book"] as const;

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const int = (v: FormDataEntryValue | null, min: number, max: number, fallback: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const todayInBangkok = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
/** Guides and diary appear on many public pages (lists, home) and in the sitemap: refresh them all. */
const refreshSite = () => {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
};

// ---- Session ----

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!adminConfigured()) return { ok: false, message: "Login isn't set up yet: add ADMIN_PASSWORD to the environment variables." };
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
  if (!rateLimit(`admin-login:${ip}`, { capacity: 5, refillPerSec: 1 / 60 })) {
    return { ok: false, message: "Too many attempts. Please wait a few minutes and try again." };
  }
  if (!checkCredentials(String(fd.get("username") ?? ""), String(fd.get("password") ?? ""))) {
    return { ok: false, message: "Wrong username or password." };
  }
  await createSession();
  redirect("/admin/leads");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

// ---- Assistant ----

export async function saveNotes(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  await saveAssistantNotes(String(fd.get("notes") ?? ""));
  revalidatePath("/admin/assistant");
  return { ok: true, message: "Saved. The assistant uses this from the next message." };
}

export async function uploadDocument(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a PDF or TXT file." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, message: "That file is over 4 MB. Try a smaller PDF, or paste the text into a .txt file." };
  const ext = file.name.toLowerCase().split(".").pop();
  let text: string;
  try {
    if (ext === "pdf" || file.type === "application/pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
      text = (await extractText(pdf, { mergePages: true })).text;
    } else if (ext === "txt" || ext === "md" || file.type.startsWith("text/")) {
      text = await file.text();
    } else {
      return { ok: false, message: "Only PDF and TXT files are supported." };
    }
  } catch (err) {
    console.error("[admin] document read failed", err);
    return { ok: false, message: "Couldn't read that file. Is it a valid PDF?" };
  }
  text = text.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) return { ok: false, message: "No text found in that file (a scanned PDF is only images). Try a TXT file instead." };
  const title = str(fd, "title", 200) || file.name.replace(/\.[^.]+$/, "");
  await addDocument({ title, filename: file.name.slice(0, 200), content: text });
  revalidatePath("/admin/documents");
  return {
    ok: true,
    message:
      text.length > MAX_DOC_CHARS
        ? `Added, but only the first ${MAX_DOC_CHARS.toLocaleString("en")} characters are kept. Consider splitting it.`
        : "Added. The assistant can use it from the next message.",
  };
}

export async function toggleDocument(fd: FormData): Promise<void> {
  await requireAdmin();
  await setDocumentActive(str(fd, "id", 100), fd.get("active") === "1");
  revalidatePath("/admin/documents");
}

export async function removeDocument(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteDocument(str(fd, "id", 100));
  revalidatePath("/admin/documents");
}

// ---- Guides ----

export async function saveGuide(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const isNew = fd.get("isNew") === "1";
  const slug = str(fd, "slug", 80).toLowerCase();
  if (!SLUG_RE.test(slug)) return { ok: false, message: "The URL name can only use a–z, 0–9 and dashes, e.g. health-for-parents." };
  const existing = await getGuideDoc(slug);
  if (isNew && existing) return { ok: false, message: "There is already a guide with this URL name." };
  if (!isNew && !existing) return { ok: false, message: "This guide no longer exists." };

  const loc = (l: "th" | "en"): GuideLocaleDoc => ({
    title: str(fd, `${l}.title`, 200),
    subtitle: str(fd, `${l}.subtitle`, 400),
    readingMinutes: int(fd.get(`${l}.readingMinutes`), 1, 60, 5),
    summary: lines(str(fd, `${l}.summary`, 3000)).slice(0, 8),
    body: String(fd.get(`${l}.body`) ?? "").slice(0, 80_000),
  });
  const th = loc("th");
  const en = loc("en");
  if (!th.title || !en.title) return { ok: false, message: "Please fill in the title in both Thai and English." };
  const icon = String(fd.get("icon"));
  const tool = String(fd.get("relatedTool") ?? "");

  const doc: GuideDoc = {
    slug,
    icon: (GUIDE_ICONS as readonly string[]).includes(icon) ? (icon as GuideDoc["icon"]) : "book",
    order: int(fd.get("order"), 0, 999, 99),
    updated: todayInBangkok(),
    ...((TOOL_SLUGS as readonly string[]).includes(tool) ? { relatedTool: tool as ToolSlug } : {}),
    th,
    en,
  };
  await saveGuideDoc(doc);
  refreshSite();
  if (isNew) redirect(`/admin/guides/${slug}`);
  return { ok: true, message: "Saved. The site is updated." };
}

export async function deleteGuide(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteGuideDoc(str(fd, "slug", 80));
  refreshSite();
  redirect("/admin/guides");
}

// ---- Diary ----

export async function saveDiary(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const isNew = fd.get("isNew") === "1";
  const slug = str(fd, "slug", 80).toLowerCase();
  if (!SLUG_RE.test(slug)) return { ok: false, message: "The URL name can only use a–z, 0–9 and dashes, e.g. a-rainy-tuesday." };
  const existing = await getDiaryDoc(slug);
  if (isNew && existing) return { ok: false, message: "There is already a diary entry with this URL name." };
  if (!isNew && !existing) return { ok: false, message: "This entry no longer exists." };

  const date = str(fd, "date", 10);
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) return { ok: false, message: "Please pick a date." };
  const loc = (l: "th" | "en"): DiaryLocaleDoc => ({
    title: str(fd, `${l}.title`, 200),
    excerpt: str(fd, `${l}.excerpt`, 600),
    body: String(fd.get(`${l}.body`) ?? "").slice(0, 80_000),
  });
  const th = loc("th");
  const en = loc("en");
  if (!th.title || !en.title) return { ok: false, message: "Please fill in the title in both Thai and English." };

  const doc: DiaryDoc = {
    slug,
    date,
    dateline: { th: str(fd, "th.dateline", 120), en: str(fd, "en.dateline", 120) },
    tags: str(fd, "tags", 300)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10),
    th,
    en,
  };
  await saveDiaryDoc(doc);
  refreshSite();
  if (isNew) redirect(`/admin/diary/${slug}`);
  return { ok: true, message: "Saved. The site is updated." };
}

export async function deleteDiary(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteDiaryDoc(str(fd, "slug", 80));
  refreshSite();
  redirect("/admin/diary");
}
