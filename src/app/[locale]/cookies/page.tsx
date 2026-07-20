import React, { Suspense } from "react";
import Footer from "@/components/Sections/footer/Footer";
import CookiesContent from "./CookiesContent";

export default function CookiePolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-black">Loading cookie policy…</p>
        </div>
      }
    >
      <div className="page-wrapper relative min-h-screen">
        <main id="main-content" tabIndex={-1} className="main-content relative z-20 bg-white pt-[132px] md:pt-[92px] lg:pt-[172px]">
          <CookiesContent />
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}
