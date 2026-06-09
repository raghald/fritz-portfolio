// Dynamiczny sitemap.xml — generowany przy `next build` (output: "export").
// Trafia do out/sitemap.xml jako statyczny plik, identyczny w zachowaniu
// jak poprzedni public/sitemap.xml, ale 1:1 z prawdziwymi route'ami:
//   - statyczne ścieżki (home, about, works listing, gallery, cookies)
//   - case studies z WORKS (worksData.ts)
//   - dla każdej ścieżki: wariant EN (bez prefiksu) + PL (pod /pl/)
//   - hreflang alternates (en / pl / x-default)
//
// Schemat XML pozostaje zgodny z tym, co już zindexował Google — nie wymaga
// re-submission w Search Console.
import type { MetadataRoute } from "next";
import { WORKS } from "@/data/worksData";

const BASE_URL = "https://www.fritzglowacki.com";

// Mapowanie workId → segment URL (zgodne z routingiem w app/[locale]/works/*/page.tsx
// oraz SLUG_BY_WORK_ID w lib/caseStudyMetadata.ts).
const SLUG_BY_WORK_ID: Record<string, string> = {
  "absolvent-agency": "absolvent",
  "kobu-studio": "kobu-studio",
  "pasibus-job-board": "pasibus",
  "pharmovit-store": "pharmovit",
  "talentdays-blog": "talentdays",
  "tutlo-recommendation": "tutlo",
};

// Data ostatniej istotnej aktualizacji treści statycznej (home/about/works listing/gallery).
// Aktualizuj ręcznie przy znaczących zmianach treści — Google traktuje lastmod
// jako sygnał świeżości i może obniżyć do niego zaufanie jeśli zawsze "skacze".
const SITE_UPDATED = "2026-06-09";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const sitemapPair = (
  path: string,
  opts: {
    lastModified?: string;
    changeFrequency?: ChangeFreq;
    priority?: number;
  } = {}
): MetadataRoute.Sitemap => {
  const urlEn = `${BASE_URL}${path}`;
  const urlPl = `${BASE_URL}/pl${path}`;

  const alternates = {
    languages: {
      en: urlEn,
      pl: urlPl,
      "x-default": urlEn,
    },
  };

  const lastModified = opts.lastModified ? new Date(opts.lastModified) : undefined;

  return [
    {
      url: urlEn,
      lastModified,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates,
    },
    {
      url: urlPl,
      lastModified,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates,
    },
  ];
};

// `force-static` jawnie zaznacza, że to nie jest dynamic route — pasuje do
// output: "export" i upewnia, że Next zapisze plik na dysk przy build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    ...sitemapPair("/", {
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 1.0,
    }),
    ...sitemapPair("/about/", {
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...sitemapPair("/works/", {
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    }),
    ...sitemapPair("/gallery/", {
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    // /cookies/ celowo poza sitemap — strona ma robots: noindex
    // (zob. src/app/[locale]/cookies/layout.tsx). Listowanie noindex
    // URL-i w sitemap generuje warning w Search Console.
  ];

  const caseStudies: MetadataRoute.Sitemap = WORKS.flatMap((work) => {
    const slug = SLUG_BY_WORK_ID[work.id];
    if (!slug) return [];

    // Fallback dla case studies bez updatedAt: środek roku, w którym zrobione.
    // To "uczciwsze" dla Google niż build date dla każdego URL-a.
    const lastmod = work.updatedAt ?? `${work.year}-06-01`;

    return sitemapPair(`/works/${slug}/`, {
      lastModified: lastmod,
      changeFrequency: "yearly",
      priority: 0.8,
    });
  });

  return [...staticPages, ...caseStudies];
}
