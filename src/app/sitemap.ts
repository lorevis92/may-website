import type { MetadataRoute } from "next";
import { site } from "@/lib/site.config";
import { locales } from "@/i18n/config";
import { listDiary, listGuides } from "@/lib/content-store";
import { TOOL_SLUGS } from "@/lib/tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [guides, diary] = await Promise.all([listGuides(), listDiary()]);
  const statics = ["", "/about", "/tools", "/guides", "/diary", "/chat", "/book"];
  const paths = [
    ...statics,
    ...TOOL_SLUGS.map((s) => `/tools/${s}`),
    ...guides.map((g) => `/guides/${g.slug}`),
    ...diary.map((d) => `/diary/${d.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${p}`,
      lastModified: now,
      changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p.startsWith("/tools") ? 0.8 : 0.6,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${p}`])) },
    })),
  );
}
