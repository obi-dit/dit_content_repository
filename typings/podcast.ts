export interface Podcast {
  id: string;
  title: string;
  description: string;
  isLive: boolean;
  zoomLink?: string;
  streamEmbedUrl?: string;
  createdAt: string;
  durationMinutes?: number;
  watchUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  showId?: string;
}

export interface PodcastDetail extends Podcast {
  content: string;
  updatedAt: string;
}

export interface PaginatedPodcasts {
  items: Podcast[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SubscriptionAccessStatus = "active" | "expired" | "none";

export interface SubscriptionStatus {
  isActive: boolean;
  /** Prefer this over deriving from isActive alone. */
  status?: SubscriptionAccessStatus;
  plan?: string;
  expiresAt?: string;
}
