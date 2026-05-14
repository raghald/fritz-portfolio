import type { Metadata } from "next";
import KobuContent from "./KobuContent";
import { buildCaseStudyMetadata } from "@/lib/caseStudyMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata({
    locale,
    workId: "kobu-studio",
    i18nKey: "Works.KobuStudio",
  });
}

export default function KobuStudioPage() {
  return (
    <main className="main-content relative z-20 bg-white">
      <KobuContent />
    </main>
  );
}
