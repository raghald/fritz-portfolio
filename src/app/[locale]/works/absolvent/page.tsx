import type { Metadata } from "next";
import AbsolventContent from "./AbsolventContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "absolvent-agency",
    i18nKey: "Works.absolvent",
  });
}

export default function AbsolventPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <AbsolventContent />
    </main>
  );
}
