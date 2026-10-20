import type { DiaryEntry, Guide } from "./types";
import protection101 from "./guides/protection-101";
import retirementPlan from "./guides/retirement-plan";
import taxSaving2026 from "./guides/tax-saving-2026";
import newParents from "./guides/new-parents";
import whyIDoThis from "./diary/why-i-do-this";
import parentQuestion from "./diary/the-question-every-parent-asks";
import octoberTax from "./diary/october-tax-season";

export const guides: Guide[] = [protection101, retirementPlan, taxSaving2026, newParents].sort((a, b) => a.order - b.order);
export const diary: DiaryEntry[] = [whyIDoThis, parentQuestion, octoberTax].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const getDiaryEntry = (slug: string) => diary.find((d) => d.slug === slug);
