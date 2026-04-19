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

export interface SubscriptionStatus {
  isActive: boolean;
  plan?: string;
  expiresAt?: string;
}
