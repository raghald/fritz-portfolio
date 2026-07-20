import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WORKS, slugForWork, type WorkItem } from "@/data/worksData";

const BASE_URL = "https://www.fritzglowacki.com";

/**
 * Buduje JSON-LD CreativeWork dla konkretnego case study.
 * Wstawiany przez page.tsx (server component) — gwarantuje obecność
 * schema.org markup w statycznym HTML, bez wymogu hydratacji.
 */
export async function buildCaseStudyJsonLd(opts: {
  locale: string;
  workId: WorkItem["id"];
  i18nKey: string;
}): Promise<Record<string, unknown>> {
  const { locale, workId, i18nKey } = opts;
  const isPl = locale === "pl";
  const t = await getTranslations({ locale, namespace: i18nKey });

  const work = WORKS.find((w) => w.id === workId);
  const slug = work ? slugForWork(work) : workId;
  const path = isPl ? `/pl/works/${slug}/` : `/works/${slug}/`;

  const heading = t("heading");
  const intro = t("intro");
  const image = work?.coverSrc
    ? `${BASE_URL}${work.coverSrc}`
    : `${BASE_URL}/images/OG.webp`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${BASE_URL}${path}#case-study`,
    name: heading,
    headline: heading,
    description: intro,
    url: `${BASE_URL}${path}`,
    inLanguage: isPl ? "pl-PL" : "en-US",
    image,
    ...(work?.year ? { dateCreated: work.year } : {}),
    ...(work?.client ? { about: work.client } : {}),
    author: { "@id": `${BASE_URL}/#person` },
    creator: { "@id": `${BASE_URL}/#person` },
    isPartOf: { "@id": `${BASE_URL}/#website` },
    ...(work?.liveUrl
      ? {
          mainEntityOfPage: work.liveUrl.startsWith("http")
            ? work.liveUrl
            : `https://${work.liveUrl}`,
        }
      : {}),
  };
}

export async function buildCaseStudyMetadata(opts: {
  locale: string;
  workId: WorkItem["id"];
  i18nKey: string;
}): Promise<Metadata> {
  const { locale, workId, i18nKey } = opts;
  const isPl = locale === "pl";
  const t = await getTranslations({ locale, namespace: i18nKey });

  const work = WORKS.find((w) => w.id === workId);
  const slug = work ? slugForWork(work) : workId;
  const pathEn = `/works/${slug}/`;
  const pathPl = `/pl/works/${slug}/`;
  const currentPath = isPl ? pathPl : pathEn;

  const heading = t("heading");
  const intro = t("intro");

  // Meta description: limit ~155 znaków (Google docina dłuższe w SERP).
  // OG/Twitter description: do ~200 znaków (LinkedIn/Slack/Discord pokazują
  // pełniejszy lead niż Google SERP).
  const metaDescription =
    intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}…` : intro;
  const socialDescription =
    intro.length > 200 ? `${intro.slice(0, 197).trimEnd()}…` : intro;

  const title = isPl
    ? `${heading} — Case Study — Fritz Głowacki`
    : `${heading} — Case Study — Fritz Glowacki`;

  const ogImage = work?.coverSrc ?? "/images/OG.webp";
  const ogTitle = heading;

  return {
    metadataBase: new URL(BASE_URL),
    title: { absolute: title },
    description: metaDescription,

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
      description: socialDescription,
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
      description: socialDescription,
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
