import { HttpService } from "./httpService";
import {
  PodcastDetail,
  PaginatedPodcasts,
  SubscriptionStatus,
} from "@/typings/podcast";
import type { SubscriberDashboardExtras } from "@/typings/subscriber-dashboard";

const MOCK_DASHBOARD_EXTRAS: SubscriberDashboardExtras = {
  upcoming: [
    {
      id: "u1",
      title: "After Hours Lounge — Guest Spotlight",
      description: "Special guest episode with audience Q&A.",
      startsAt: "2026-04-05T21:00:00Z",
      host: "Marcus Cole",
    },
    {
      id: "u2",
      title: "Straight Talk: Red Flags & Green Flags",
      description: "Panel discussion — bring your questions.",
      startsAt: "2026-04-12T20:00:00Z",
      host: "Elena Ruiz",
    },
    {
      id: "u3",
      title: "The Upgrade: Nutrition Deep Dive",
      description: "Meal planning for busy professionals.",
      startsAt: "2026-04-19T19:30:00Z",
      host: "Dr. Amir Shah",
    },
  ],
  questions: [
    {
      id: "q1",
      text: "How do you handle nerves before a first date after divorce?",
      status: "answered",
      submittedAt: "2026-03-10T18:00:00Z",
      sessionTitle: "After Hours Lounge — Live Q&A",
    },
    {
      id: "q2",
      text: "Will there be a replay if I miss the Thursday live show?",
      status: "pending",
      submittedAt: "2026-03-21T09:15:00Z",
    },
  ],
  announcements: [
    {
      id: "a1",
      title: "Live this week",
      body: "Subscriber-only stream Thursday 9 PM ET — enable notifications so you don't miss the start.",
      kind: "live",
      createdAt: "2026-03-30T12:00:00Z",
    },
    {
      id: "a2",
      title: "Library update",
      body: "Five new past episodes were added to your library, including the full Miami meet-up recap.",
      kind: "update",
      createdAt: "2026-03-28T10:00:00Z",
    },
  ],
  recommendations: [
    {
      id: "r1",
      podcastId: "3",
      title: "Straight Talk Sessions: What Women Actually Want",
      reason: "Because you finished a dating-focused episode last week",
      thumbnailLabel: "ST",
    },
    {
      id: "r2",
      podcastId: "5",
      title: "Chemistry Lab: The Science of Attraction",
      reason: "Popular with members who watch interview shows",
      thumbnailLabel: "CL",
    },
    {
      id: "r3",
      podcastId: "4",
      title: "The Upgrade Podcast: Fitness After 40",
      reason: "Pairs well with your recent lifestyle content",
      thumbnailLabel: "UP",
    },
  ],
};

export class PodcastService extends HttpService {
  constructor() {
    super();
  }

  async getPodcasts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedPodcasts> {
    const qp = new URLSearchParams();
    if (params?.page) qp.set("page", String(params.page));
    if (params?.limit) qp.set("limit", String(params.limit));
    if (params?.search) qp.set("search", params.search);
    const qs = qp.toString();
    return this.get<PaginatedPodcasts>(
      `/api/content/podcasts${qs ? `?${qs}` : ""}`,
    );
  }

  async getPodcastById(id: string): Promise<PodcastDetail> {
    return this.get<PodcastDetail>(`/api/content/podcasts/${id}`);
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      return await this.get<SubscriptionStatus>("/api/subscription/status");
    } catch {
      return { isActive: false };
    }
  }

  async getSubscriberDashboardExtras(): Promise<SubscriberDashboardExtras> {
    try {
      return await this.get<SubscriberDashboardExtras>(
        "/api/subscriber/dashboard-extras"
      );
    } catch {
      return MOCK_DASHBOARD_EXTRAS;
    }
  }
}

export const podcastService = new PodcastService();
