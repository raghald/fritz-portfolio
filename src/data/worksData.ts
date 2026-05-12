// data/worksData.ts

export type WorkType =
  | "E-commerce"
  | "LandingPage"
  | "Website"
  | "LoFi"
  | "Framer";

export type WorkLayoutVariant = "vertical" | "horizontal";

export type WorkCaseStepId =
  | "audit"
  | "ux-ui"
  | "mobile"
  | "finalization"
  | "implementer"
  | "layout-implementation"
  | "responsive-setup"
  | "performance-optimization"
  | "seo-setup"
  | "launch";

export type WorkItem = {
  id: string;
  type: WorkType[];
  year: string;
  coverSrc: string; 
  videoSrc?: string;
  href: string;
  layout: WorkLayoutVariant;

  client?: string;
  tools?: string;
  liveUrl?: string;

  case?: {
    heroVideo: string;
    rangeVideo1?: string;
    rangeVideo2?: string;
    steps: WorkCaseStepId[];
  };
};

export const WORK_TYPES: (WorkType | "All")[] = [
  "All",
  "E-commerce",
  "LandingPage",
  "Website",
  "LoFi",
  "Framer",
];

export const WORKS: WorkItem[] = [
  {
    id: "talentdays-blog",
    type: ["Website"],
    year: "2024",
    coverSrc: "/images/Case_Studies/Talent_Days/Cover_TalentDays_1080x1080.webp",
    videoSrc: "/videos/talentdays.webm",
    href: "/works/talentdays",
    layout: "horizontal",
    client: "Talent Days",
    tools: "Figma",
    liveUrl: "https://www.talentdays.pl/blog",
    case: {
      heroVideo: "/videos/Video_1_TD.mp4",
      rangeVideo1: "/videos/Video_2_TD.mp4",
      rangeVideo2: "/videos/Video_3_TD.mp4",
      steps: ["audit", "ux-ui", "finalization"],
    },
  },
  {
    id: "pharmovit-store",
    type: ["E-commerce"],
    year: "2022",
    coverSrc: "/images/Case_Studies/Pharmovit/Cover_Pharmovit_1080x1080.webp",
    videoSrc: "/videos/Cover_Pharmovit_1080x1080.webm",
    href: "/works/pharmovit",
    layout: "vertical",
    client: "Pharmovit",
    tools: "Figma",
    liveUrl: "https://www.pharmovit.pl",
    case: {
      heroVideo: "/videos/Video_1_pharmo.mp4",
      rangeVideo1: "/videos/Video_2_pharmo.mp4",
      rangeVideo2: "/videos/Video_3_pharmo.mp4",
      steps: ["audit", "ux-ui", "mobile", "finalization"],
    },
  },
  {
    id: "pasibus-job-board",
    type: ["LoFi"],
    year: "2025",
    coverSrc: "/images/Case_Studies/Pasibus/Cover_Pasibus_1080x1080.webp",
    videoSrc: "/videos/pasibus-cover.webm",
    href: "/works/pasibus",
    layout: "vertical",
    client: "Pasibus",
    tools: "Figma",
    liveUrl: "https://praca.pasibus.pl",
    case: {
      heroVideo: "/videos/Pasibus_Video_1.mp4",
      rangeVideo1: "/videos/Pasibus_Video_2.mp4",
      rangeVideo2: "/videos/Pasibus_Video_3.mp4",
      steps: ["audit", "ux-ui", "finalization"],
    },
  },
  {
    id: "tutlo-recommendation",
    type: ["LandingPage"],
    year: "2025",
    coverSrc: "/images/Case_Studies/Tutlo_Reco/Cover_Tutlo_1080x1080.webp",
    videoSrc: "/videos/tutlo2.webm",
    href: "/works/tutlo",
    layout: "horizontal",
    client: "Tutlo",
    tools: "Figma",
    case: {
      heroVideo: "/videos/TutloLEAD_2_Video_1.mp4",
      rangeVideo1: "/videos/TutloLEAD_2_Video_2.mp4",
      rangeVideo2: "/videos/TutloLEAD_2_Video_3.mp4",
      steps: ["audit", "ux-ui", "mobile", "finalization"],
    },
  },
    {
  id: "kobu-studio",
  type: ["Website", "Framer"],
  year: "2026",
  coverSrc: "/images/Case_Studies/Kobu/Cover_Kobu_1080x1080.webp",
  videoSrc: "/videos/kobu-studio.webm",
  href: "/works/kobu-studio",
  layout: "horizontal",
  client: "Kobu Studio",
  tools: "Figma | Framer",
  liveUrl: "https://studiokobu.com",

  case: {
    heroVideo: "/videos/Video_Kobu_1.webm",
    rangeVideo1: "/videos/Video_Kobu_2.webm",
    rangeVideo2: "/videos/Video_Kobu_3.webm",
    steps: [
      "layout-implementation",
      "responsive-setup",
      "performance-optimization",
      "seo-setup",
      "launch",
    ],
  },
},
  {
    id: "absolvent-agency",
    type: ["Website"],
    year: "2025",
    coverSrc: "/images/Case_Studies/Absolvent/Cover_Absolvent_1080x1080.webp",
    videoSrc: "/videos/absolvent.webm",
    href: "/works/absolvent",
    layout: "vertical",
    client: "Absolvent Consulting",
    tools: "Figma",
    liveUrl: "https://www.absolventconsulting.pl",
    case: {
      heroVideo: "/videos/AC_Video_1.mp4",
      rangeVideo1: "/videos/AC_Video_2.mp4",
      rangeVideo2: "/videos/AC_Video_3.mp4",
      steps: ["audit", "implementer", "ux-ui", "mobile", "finalization"],
    },
  },
];
