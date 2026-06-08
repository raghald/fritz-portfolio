"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  start?: string;
  end?: string;
};

export default function RevealOnScroll({ children, className, start, end }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ start, end });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
