"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { addDocument, deleteDocument, MAX_DOC_CHARS, saveAssistantNotes, setDocumentActive } from "@/lib/assistant-store";
import { adminConfigured, checkCredentials, createSession, destroySession, requireAdmin, setEditHint } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

/** Result shown under an admin form (see components/admin/ActionForm). */
export type ActionState = { ok: boolean; message: string } | null;

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);

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

/** "Edit the site": shows the edit button on the public pages in this browser and opens the home page in edit mode. */
export async function editSite(): Promise<void> {
  await requireAdmin();
  await setEditHint();
  redirect("/th?edit=1");
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
