/**
 * Everything personal about May lives here so the whole site can be updated
 * from one file. Values marked TODO are safe placeholders — replace them before
 * going live.
 */
export const site = {
  /** Public site URL (no trailing slash). Used for canonical links, sitemap and OG tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.may-advisor.com",
  name: { th: "เมย์", en: "May" },
  /** Shown in the header next to the name. */
  tagline: {
    th: "ที่ปรึกษาประกันและการเงิน · AIA",
    en: "Insurance & financial advisor · AIA",
  },
  /** TODO: May's full name as printed on her licence (optional, shown in footer). */
  fullName: { th: "เมย์", en: "May" },
  company: "AIA Thailand",
  /** Credentials are rendered as small badges across the site. */
  credentials: {
    mdrt: true,
    /** TODO: add the qualifying years, e.g. [2024, 2025, 2026]. Leave empty to show "MDRT member" only. */
    mdrtYears: [] as number[],
    /** Life insurance agent licence no. — TODO replace. Shown in the footer as required by the OIC. */
    agentLicenseNo: "XXXXXXXXXX",
    /** Investment Consultant licence (unit-linked / funds). Set to "" to hide. TODO replace. */
    icLicenseNo: "XXXXXX",
    /** Non-life (general insurance) licence if she has one. Set to "" to hide. */
    nonLifeLicenseNo: "",
  },
  /** Primary ways to reach May. Empty string hides the channel. TODO replace. */
  contact: {
    lineId: "@rungmai",
    /** Full LINE add-friend link, e.g. https://line.me/R/ti/p/@xxxx */
    lineUrl: "https://line.me/R/ti/p/@rungmai",
    phone: "+66 80 943 9281",
    phoneHref: "tel:+66809439281",
    email: "wealthprime14@gmail.com",
    facebook: "",
    instagram: "",
    /** City shown in "based in" copy. */
    city: { th: "กรุงเทพฯ", en: "Bangkok" },
  },
  /** Which locale is the default and which are supported. */
  locales: ["th", "en"] as const,
  defaultLocale: "th" as const,
  /** Social proof numbers — keep honest. Set to null to hide a stat. TODO update. */
  stats: {
    yearsExperience: 8,
    familiesHelped: 300,
    responseTime: { th: "ภายใน 1 วัน", en: "within a day" },
  },
  /** Booking slots offered in the "book a chat" form. Free text — edit freely. */
  bookingWindows: {
    th: ["เช้า (9:00–12:00)", "บ่าย (13:00–17:00)", "เย็น (18:00–20:00)", "เสาร์–อาทิตย์"],
    en: ["Morning (9–12)", "Afternoon (1–5pm)", "Evening (6–8pm)", "Weekend"],
  },
};

export type Locale = (typeof site.locales)[number];
