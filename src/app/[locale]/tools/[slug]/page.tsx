import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, locales } from "@/i18n";
import { TOOL_SLUGS, type ToolSlug } from "@/lib/tools";
import { QuizTool } from "@/components/tools/QuizTool";
import { CoverageTool } from "@/components/tools/CoverageTool";
import { RetirementTool } from "@/components/tools/RetirementTool";
import { TaxTool } from "@/components/tools/TaxTool";
import { EducationTool } from "@/components/tools/EducationTool";
import { HealthCheckTool } from "@/components/tools/HealthCheckTool";

const keyOf = { quiz: "quiz", coverage: "coverage", retirement: "retirement", tax: "tax", education: "education", "health-check": "healthCheck" } as const;

export function generateStaticParams() {
  return locales.flatMap((locale) => TOOL_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!TOOL_SLUGS.includes(slug as ToolSlug)) return {};
  const t = getMessages(isLocale(locale) ? locale : "th");
  const data = t.tools[keyOf[slug as ToolSlug]];
  return { title: data.name, description: data.tagline };
}

export default async function ToolPage({ params }: PageProps<"/[locale]/tools/[slug]">) {
  const { slug } = await params;
  switch (slug as ToolSlug) {
    case "quiz":
      return <QuizTool />;
    case "coverage":
      return <CoverageTool />;
    case "retirement":
      return <RetirementTool />;
    case "tax":
      return <TaxTool />;
    case "education":
      return <EducationTool />;
    case "health-check":
      return <HealthCheckTool />;
    default:
      notFound();
  }
}
