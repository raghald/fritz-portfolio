import type { Metadata } from "next";
import PharmovitContent from "./PharmovitContent";
import JsonLd from "@/components/JsonLd";
import { buildCaseStudyMetadata, buildCaseStudyJsonLd } from "@/lib/caseStudyMetadata";

const WORK_ID = "pharmovit-store";
const I18N_KEY = "Works.pharmovit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({ locale, workId: WORK_ID, i18nKey: I18N_KEY });
}

export default async function PharmovitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const jsonLd = await buildCaseStudyJsonLd({ locale, workId: WORK_ID, i18nKey: I18N_KEY });

  return (
    <main className="main-content relative z-20 bg-white">
      <JsonLd data={jsonLd} />
      <PharmovitContent />
    </main>
  );
}
