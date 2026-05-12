// Utility function to get poster path from video path
export function getVideoPosterPath(
  videoSrc: string,
  format: "jpg" | "webp" = "jpg"
): string {
  // Remove extension and add -poster suffix
  const pathWithoutExt = videoSrc.replace(/\.[^/.]+$/, "");
  return `${pathWithoutExt}-poster.${format}`;
}

// Check if poster exists (client-side only)
export async function checkPosterExists(posterPath: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const response = await fetch(posterPath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

// Preload poster image for better UX
export function preloadPoster(posterPath: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = posterPath;
  document.head.appendChild(link);
}
