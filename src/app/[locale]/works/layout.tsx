// app/[locale]/works/layout.tsx
import Footer from "@/components/Sections/footer/Footer";

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper relative min-h-screen bg-white">
      {children}
      <Footer />
    </div>
  );
}
