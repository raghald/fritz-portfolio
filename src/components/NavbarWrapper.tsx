"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

import Navbar from "./Sections/navbar/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const locale = useLocale();

  const cleanedPath = pathname.replace(`/${locale}`, "") || "/";
  const isHome = cleanedPath === "/";

  return <Navbar variant={isHome ? "sticky" : "static"} />;
}
