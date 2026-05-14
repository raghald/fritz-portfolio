import type { Metadata } from "next";
import TalentDaysContent from "./TalentDaysContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "talentdays-blog",
    i18nKey: "Works.talentdays",
  });
}

export default function TalentDaysPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <TalentDaysContent />
    </main>
  );
}
