export interface ScheduledEpisode {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  host?: string;
}

export type QuestionStatus = "pending" | "answered" | "featured";

export interface SubscriberQuestion {
  id: string;
  text: string;
  status: QuestionStatus;
  submittedAt: string;
  sessionTitle?: string;
}

export type AnnouncementKind = "live" | "update" | "reminder";

export interface DashboardAnnouncement {
  id: string;
  title: string;
  body: string;
  kind: AnnouncementKind;
  createdAt: string;
}

export interface EpisodeRecommendation {
  id: string;
  podcastId: string;
  title: string;
  reason: string;
  thumbnailLabel?: string;
}

export interface SubscriberDashboardExtras {
  upcoming: ScheduledEpisode[];
  questions: SubscriberQuestion[];
  announcements: DashboardAnnouncement[];
  recommendations: EpisodeRecommendation[];
}
