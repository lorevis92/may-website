import type { IconName } from "@/components/ui/Icon";

export const TOOL_SLUGS = ["quiz", "coverage", "retirement", "tax", "education", "health-check"] as const;
export type ToolSlug = (typeof TOOL_SLUGS)[number];
export const toolMessageKey = { quiz: "quiz", coverage: "coverage", retirement: "retirement", tax: "tax", education: "education", "health-check": "healthCheck" } as const;

export const TOOL_META: Record<ToolSlug, { icon: IconName; tone: "rose" | "sage" | "honey" | "sky" | "plum" }> = {
  quiz: { icon: "sparkle", tone: "rose" },
  coverage: { icon: "shield", tone: "sage" },
  retirement: { icon: "sunrise", tone: "honey" },
  tax: { icon: "receipt", tone: "sky" },
  education: { icon: "sprout", tone: "plum" },
  "health-check": { icon: "heart", tone: "rose" },
};

export const toneBg: Record<string, string> = {
  rose: "bg-rose-soft text-rose-deep",
  sage: "bg-sage-soft text-sage-deep",
  honey: "bg-honey-soft text-[#b47f22]",
  sky: "bg-sky-soft text-[#2f6c9a]",
  plum: "bg-plum-soft text-plum",
};
