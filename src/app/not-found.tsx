// Root-level not-found — używany przez Next.js przy generowaniu /404 fallback
// poza kontekstem locale (np. /404.html w out/). Bez next-intl hooków, bo
// na tym poziomie locale provider nie jest zamontowany.
import Link from "next/link";

export const metadata = {
  title: "404 — Fritz Glowacki",
  description: "Page not found.",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#111",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "0 16px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "1rem" }}>
          Page not found
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.7)",
            maxWidth: 420,
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            color: "rgba(255,255,255,0.9)",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Go back home
        </Link>
      </body>
    </html>
  );
}
