import type { Metadata } from "next";
import PasibusContent from "./PasibusContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "pasibus-job-board",
    i18nKey: "Works.pasibus",
  });
}

export default function PasibusPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <PasibusContent />
    </main>
  );
}
