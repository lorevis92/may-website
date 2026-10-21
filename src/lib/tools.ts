import type { IconName } from "@/components/ui/Icon";

export const TOOL_SLUGS = ["quiz", "coverage", "retirement", "tax", "education", "health-check"] as const;
export type ToolSlug = (typeof TOOL_SLUGS)[number];
export const toolMessageKey = { quiz: "quiz", coverage: "coverage", retirement: "retirement", tax: "tax", education: "education", "health-check": "healthCheck" } as const;

export const TOOL_META: Record<ToolSlug, { icon: IconName; tone: "jasmine" | "sage" | "honey" | "sky" | "plum" }> = {
  quiz: { icon: "sparkle", tone: "jasmine" },
  coverage: { icon: "shield", tone: "sage" },
  retirement: { icon: "sunrise", tone: "honey" },
  tax: { icon: "receipt", tone: "sky" },
  education: { icon: "sprout", tone: "plum" },
  "health-check": { icon: "heart", tone: "jasmine" },
};

/** Icon tiles stay in the accent family; each tone only nudges the icon colour, never the fill. */
export const toneBg: Record<string, string> = {
  jasmine: "icon-tile",
  sage: "icon-tile text-sage-deep",
  honey: "icon-tile text-honey-deep",
  sky: "icon-tile text-sky-deep",
  plum: "icon-tile text-plum",
};
