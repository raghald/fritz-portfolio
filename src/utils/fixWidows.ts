export function fixWidows(text: string) {
  // lista spójników jednowyrazowych — możesz rozszerzyć
  const conjunctions = ["i", "a", "o", "u", "w", "z", "do", "na"];

  const pattern = new RegExp(`\\b(${conjunctions.join("|")})\\s`, "gi");

  return text.replace(pattern, (match, p1) => `${p1}\u00A0`);
}
