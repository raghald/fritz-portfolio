"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Sections/navbar/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // EN bez prefiksu, PL pod /pl/. Home = "/" lub "/pl" / "/pl/".
  const cleanedPath = pathname.replace(/^\/pl(?=\/|$)/, "") || "/";
  const isHome = cleanedPath === "/";

  return <Navbar variant={isHome ? "sticky" : "static"} />;
}
