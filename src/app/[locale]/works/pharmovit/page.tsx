import type { Metadata } from "next";
import PharmovitContent from "./PharmovitContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "pharmovit-store",
    i18nKey: "Works.pharmovit",
  });
}

export default function PharmovitPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <PharmovitContent />
    </main>
  );
}
