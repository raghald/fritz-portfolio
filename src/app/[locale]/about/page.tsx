// app/[locale]/about/page.tsx
// Server component — metadata jest w sąsiednim layout.tsx, klient w AboutPageClient.tsx.
import AboutPageClient from "./AboutPageClient";

export default function AboutPage() {
  return <AboutPageClient />;
}
