import type { Metadata } from "next";
import TutloContent from "./TutloRecommendationContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "tutlo-recommendation",
    i18nKey: "Works.tutlo",
  });
}

export default function TutloPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <TutloContent />
    </main>
  );
}
