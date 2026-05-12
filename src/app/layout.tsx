import type { ReactNode } from "react";

// Root layout celowo nie renderuje <html>/<body> — robi to [locale]/layout.tsx,
// dzięki czemu atrybut lang jest dynamiczny per locale (zgodnie z wytycznymi next-intl).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
