export function toVideoEmbedUrl(videoUrl?: string): string | null {
  if (!videoUrl || typeof videoUrl !== "string") {
    return null;
  }

  const trimmed = videoUrl.trim();
  if (
    trimmed.includes("youtube.com/embed/") ||
    trimmed.includes("youtube-nocookie.com/embed/")
  ) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.replace(/^\//, "").split("/")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname.startsWith("/watch")) {
        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (url.pathname.startsWith("/live/") || url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/").filter(Boolean)[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}
