import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WORKS, type WorkItem } from "@/data/worksData";

const BASE_URL = "https://www.fritzglowacki.com";

const SLUG_BY_WORK_ID: Record<string, string> = {
  "absolvent-agency": "absolvent",
  "kobu-studio": "kobu-studio",
  "pasibus-job-board": "pasibus",
  "pharmovit-store": "pharmovit",
  "talentdays-blog": "talentdays",
  "tutlo-recommendation": "tutlo",
};

export async function buildCaseStudyMetadata(opts: {
  locale: string;
  workId: WorkItem["id"];
  i18nKey: string;
}): Promise<Metadata> {
  const { locale, workId, i18nKey } = opts;
  const isPl = locale === "pl";
  const t = await getTranslations({ locale, namespace: i18nKey });

  const work = WORKS.find((w) => w.id === workId);
  const slug = SLUG_BY_WORK_ID[workId] ?? workId;
  const pathEn = `/en/works/${slug}/`;
  const pathPl = `/pl/works/${slug}/`;
  const currentPath = isPl ? pathPl : pathEn;

  const heading = t("heading");
  const intro = t("intro");
  const description = intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}…` : intro;

  const title = isPl
    ? `${heading} — Case Study — Fritz Głowacki`
    : `${heading} — Case Study — Fritz Glowacki`;

  const ogImage = work?.coverSrc ?? "/images/OG.webp";
  const ogTitle = heading;

  return {
    metadataBase: new URL(BASE_URL),
    title: { absolute: title },
    description,

    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${pathEn}`,
        pl: `${BASE_URL}${pathPl}`,
        "x-default": `${BASE_URL}${pathEn}`,
      },
    },

    openGraph: {
      type: "article",
      locale: isPl ? "pl_PL" : "en_US",
      alternateLocale: isPl ? "en_US" : "pl_PL",
      url: `${BASE_URL}${currentPath}`,
      siteName: "Fritz Glowacki Portfolio",
      title: ogTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1080,
          height: 1080,
          alt: heading,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
      creator: "@fritzglowacki",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
