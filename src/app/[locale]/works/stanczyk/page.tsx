import type { Metadata } from "next";
import StanczykContent from "./StanczykContent";
import JsonLd from "@/components/JsonLd";
import { buildCaseStudyMetadata, buildCaseStudyJsonLd } from "@/lib/caseStudyMetadata";

const WORK_ID = "stanczyk-app";
const I18N_KEY = "Works.Stanczyk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({ locale, workId: WORK_ID, i18nKey: I18N_KEY });
}

export default async function StanczykPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const jsonLd = await buildCaseStudyJsonLd({ locale, workId: WORK_ID, i18nKey: I18N_KEY });

  return (
    <main id="main-content" tabIndex={-1} className="main-content relative z-20 bg-white">
      <JsonLd data={jsonLd} />
      <StanczykContent />
    </main>
  );
}
