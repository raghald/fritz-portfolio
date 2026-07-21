"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "@/lib/useTranslations";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { GalleryVideo } from "./GalleryVideoCard";

// Player oparty na @vidstack/react ładowany dynamicznie (ssr:false) — trzyma
// ciężki chunk playera poza initial bundle strony Gallery. Do czasu załadowania
// chunku pokazujemy czarny kafelek (spójnie z tłem karty / bg-black).
const VideoCard = dynamic(() => import("./GalleryVideoCard"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

// Gallery video data
const galleryVideos: GalleryVideo[] = Array.from({ length: 21 }, (_, i) => ({
  id: `video-${i + 1}`,
  videoSrc: `/videos/gallery/vid${i + 1}.mp4`,
}));

const GalleryGrid: React.FC = () => {
  const t = useTranslations("gallery.grid");

  return (
    <section className="w-full max-w-[1440px] mx-auto pb-[60px] lg:pb-[90px]" aria-label={t("sectionAria")}>
      {/* Mobile / tablet / small laptop */}
      <div className="xl:hidden px-3 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-6 lg:gap-7">
          {galleryVideos.map((video) => (
            <RevealOnScroll key={video.id} className="w-full aspect-[9/16]">
              <VideoCard video={video} />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Desktop asymmetric masonry (>= 1280px).
          Ten sam artystyczny, asymetryczny układ co wcześniej, ale wyrażony
          PROPORCJONALNIE zamiast sztywnymi pikselami: kontener ma stały
          aspect-ratio (1440×6900 = przestrzeń projektowa), a każda karta ma
          pozycję/rozmiar w % tej przestrzeni. Dzięki temu cały układ skaluje
          się z szerokością kontenera (max 1440px) i nie wychodzi poza ekran
          w zakresie 1280–1439px. Karta: 320/1440 = 22.2222% szer., 552/6900 =
          8% wys. Kolumny left: 52/166/563/962/1075 px → %; pionowo okres 1587px
          z przesunięciami fazowymi per kolumna. */}
      <div className="hidden xl:block relative w-full aspect-[1440/6900]">
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[3.6111%] top-[0%] absolute">
          <VideoCard video={galleryVideos[0]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[3.6111%] top-[23%] absolute">
          <VideoCard video={galleryVideos[1]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[3.6111%] top-[46%] absolute">
          <VideoCard video={galleryVideos[2]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[11.5278%] top-[11.6957%] absolute">
          <VideoCard video={galleryVideos[3]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[11.5278%] top-[34.6957%] absolute">
          <VideoCard video={galleryVideos[4]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[11.5278%] top-[57.6957%] absolute">
          <VideoCard video={galleryVideos[5]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[39.0972%] top-[4.6667%] absolute">
          <VideoCard video={galleryVideos[6]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[39.0972%] top-[27.6667%] absolute">
          <VideoCard video={galleryVideos[7]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[39.0972%] top-[50.6667%] absolute">
          <VideoCard video={galleryVideos[8]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[74.6528%] top-[2.8841%] absolute">
          <VideoCard video={galleryVideos[9]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[74.6528%] top-[25.8841%] absolute">
          <VideoCard video={galleryVideos[10]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[74.6528%] top-[48.8841%] absolute">
          <VideoCard video={galleryVideos[11]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[66.8056%] top-[15%] absolute">
          <VideoCard video={galleryVideos[12]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[66.8056%] top-[38%] absolute">
          <VideoCard video={galleryVideos[13]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[66.8056%] top-[61%] absolute">
          <VideoCard video={galleryVideos[14]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[3.6111%] top-[69%] absolute">
          <VideoCard video={galleryVideos[15]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[11.5278%] top-[80.6957%] absolute">
          <VideoCard video={galleryVideos[16]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[39.0972%] top-[73.6667%] absolute">
          <VideoCard video={galleryVideos[17]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[74.6528%] top-[71.8841%] absolute">
          <VideoCard video={galleryVideos[18]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[66.8056%] top-[84%] absolute">
          <VideoCard video={galleryVideos[19]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-[22.2222%] h-[8%] left-[3.6111%] top-[92%] absolute">
          <VideoCard video={galleryVideos[20]} />
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default GalleryGrid;
