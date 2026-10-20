import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

const COOKIE = "may-locale";

/**
 * Locale routing: every page lives under /th or /en.
 * - "/" → redirect to the visitor's preferred locale (cookie, then Accept-Language, then Thai).
 * - "/tools" (no locale) → "/th/tools".
 * - Visiting a localized URL remembers that locale in a cookie for next time.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const res = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== first) {
      res.cookies.set(COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const cookie = request.cookies.get(COOKIE)?.value;
  let locale = isLocale(cookie) ? cookie : undefined;
  if (!locale) {
    const accept = request.headers.get("accept-language") ?? "";
    const preferred = accept
      .split(",")
      .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2))
      .find((code) => (locales as readonly string[]).includes(code));
    locale = isLocale(preferred) ? preferred : defaultLocale;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip API routes, Next internals, static files and assets in /public.
    "/((?!api|admin|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest|hero|og|.*\\..*).*)",
  ],
};
