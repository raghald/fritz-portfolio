// Server component — emituje surowy <script type="application/ld+json">.
// Używaj z layout/page (Server Components). Klient nie potrzebuje hydratacji.
type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML jest tutaj bezpieczne — `data` pochodzi z naszego kodu,
      // nie z user inputu. JSON.stringify dba o escape znaków.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
