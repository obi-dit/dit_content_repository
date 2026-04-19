import { HttpService } from "./httpService";
import type { DashboardAnnouncement } from "@/typings/subscriber-dashboard";

export type AnnouncementKind = "live" | "update" | "reminder";

export interface AdminAnnouncement {
  _id: string;
  title: string;
  body: string;
  kind: AnnouncementKind;
  published: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  body: string;
  kind: AnnouncementKind;
  published?: boolean;
  expiresAt?: string;
}

/** PATCH body; use `expiresAt: ""` to clear expiry */
export interface UpdateAnnouncementPayload {
  title?: string;
  body?: string;
  kind?: AnnouncementKind;
  published?: boolean;
  expiresAt?: string;
}

export interface AnnouncementsListResponse {
  items: AdminAnnouncement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Subscriber feed: published, non-expired (JWT required). */
export interface SubscriberAnnouncementsResponse {
  announcements: DashboardAnnouncement[];
}

class AnnouncementService extends HttpService {
  async createAnnouncement(
    payload: CreateAnnouncementPayload
  ): Promise<{ message: string; announcement: AdminAnnouncement }> {
    return this.post("/api/announcements", payload);
  }

  async listAnnouncements(params?: {
    page?: number;
    limit?: number;
  }): Promise<AnnouncementsListResponse> {
    const q: Record<string, string | number | boolean> = {};
    if (params?.page !== undefined) q.page = params.page;
    if (params?.limit !== undefined) q.limit = params.limit;
    return this.get("/api/announcements", {
      params: Object.keys(q).length ? q : undefined,
    });
  }

  async updateAnnouncement(
    id: string,
    payload: UpdateAnnouncementPayload
  ): Promise<{ message: string; announcement: AdminAnnouncement }> {
    return this.patch(`/api/announcements/${id}`, payload);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.delete(`/api/announcements/${id}`);
  }

  async listSubscriberAnnouncements(
    limit: number = 50
  ): Promise<SubscriberAnnouncementsResponse> {
    const capped = Math.min(Math.max(limit, 1), 100);
    return this.get("/api/announcements/subscriber", {
      params: { limit: capped },
    });
  }
}

export const announcementService = new AnnouncementService();
