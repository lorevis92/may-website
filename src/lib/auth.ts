import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { EDIT_HINT_COOKIE } from "@/lib/edit-types";

/**
 * Single-user login for May's admin area.
 *  - ADMIN_USERNAME (default "may") + ADMIN_PASSWORD from the environment.
 *  - Stateless session: a signed, httpOnly cookie holding only an expiry. It is signed with
 *    ADMIN_SESSION_SECRET when set, otherwise with a key derived from the password, so changing
 *    the password signs every device out.
 * Every admin page, server action and admin route handler checks the session itself (requireAdmin / isAdmin).
 */

const COOKIE = "may_admin";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const sha256 = (s: string) => createHash("sha256").update(s).digest();
/** Constant-time comparison of two strings of any length. */
const safeEqual = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b));

function signingKey(): string | null {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  return password ? createHash("sha256").update(`may-admin-session:${password}`).digest("hex") : null;
}

const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function checkCredentials(username: string, password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return false;
  const expectedUser = (process.env.ADMIN_USERNAME || "may").trim().toLowerCase();
  // Evaluate both so the timing doesn't reveal which one was wrong.
  const userOk = safeEqual(username.trim().toLowerCase(), expectedUser);
  const passwordOk = safeEqual(password, expectedPassword);
  return userOk && passwordOk;
}

export async function createSession(): Promise<void> {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  await setEditHint();
}

/**
 * Readable by the browser, and only tells the public pages to show May the "Edit page" button.
 * It grants nothing: every edit is checked against the signed session above.
 */
export async function setEditHint(): Promise<void> {
  (await cookies()).set(EDIT_HINT_COOKIE, "1", { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
  jar.delete(EDIT_HINT_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const key = signingKey();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!key || !raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: unknown };
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** For admin pages and server actions: continues only with a valid session, otherwise sends May to the login page. */
export const requireAdmin = cache(async (): Promise<void> => {
  if (!(await isAdmin())) redirect("/admin/login");
});
