/**
 * Content type slugs and display labels for Collections (aligned with backend ContentType and edit form).
 */
export const COLLECTION_CONTENT_TYPES: { slug: string; label: string }[] = [
  { slug: "tutorial", label: "Tutorial" },
  { slug: "article", label: "Article" },
  { slug: "documentation", label: "Documentation" },
  { slug: "guide", label: "Guide" },
  { slug: "video", label: "Video" },
  { slug: "other", label: "Other" },
  { slug: "podcast", label: "Podcast" },
  { slug: "ai_media", label: "AI Media" },
  { slug: "capstone_project", label: "Capstone Project" },
];

export const TYPE_SLUG_TO_LABEL: Record<string, string> =
  Object.fromEntries(
    COLLECTION_CONTENT_TYPES.map((t) => [t.slug, t.label])
  );

export const VALID_TYPE_SLUGS = new Set(
  COLLECTION_CONTENT_TYPES.map((t) => t.slug)
);
