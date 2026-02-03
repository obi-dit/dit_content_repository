import { HttpService } from "./httpService";
import { getUser } from "@/utils/auth";

export interface Content {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  status: "published" | "draft" | "archived";
  imageUrl?: string;
  videoUrl?: string;
}

export interface PublicContent {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "published" | "draft" | "archived";
  views: number;
  imageUrl?: string;
  videoUrl?: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicContentDetail extends PublicContent {
  content: string;
}

export default class ContentService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Get all published content (public - no auth required)
   */
  async getPublishedContent(): Promise<PublicContent[]> {
    return this.get<PublicContent[]>("/api/content/public/published", {
      skipAuth: true,
    });
  }

  /**
   * Get a single published content by ID (public - no auth required)
   * Also tracks unique views per user
   * Sends x-user-id header if user is logged in for proper view tracking
   */
  async getPublicContentById(id: string): Promise<PublicContentDetail> {
    const user = getUser();
    const headers: Record<string, string> = {};

    // Send user ID in header for view tracking if logged in
    if (user?.id) {
      headers["x-user-id"] = user.id;
    }

    return this.get<PublicContentDetail>(`/api/content/public/${id}`, {
      skipAuth: true,
      headers,
    });
  }

  async createContent(content: Partial<Content>) {
    return this.post("/api/content", content);
  }

  async getAllContents(): Promise<Content[]> {
    return this.get("/api/content");
  }

  async getContentById(id: string): Promise<
    Content & {
      _id: string;
      createdAt: string;
      updatedAt: string;
      views: number;
      userId: string;
    }
  > {
    return this.get(`/api/content/${id}`);
  }

  async updateContent(id: string, content: Partial<Content>) {
    return this.put(`/api/content/${id}`, content);
  }

  async uploadContentImage(
    image: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await this.post<{
      success: boolean;
      imageUrl: string;
      publicId: string;
    }>("/api/content/upload/image", formData, {
      skipAuth: false,
      onUploadProgress: onProgress
        ? (event) => {
            const progress = event.total
              ? Math.round((event.loaded * 100) / event.total)
              : 0;
            onProgress(progress);
          }
        : undefined,
    });

    return response.imageUrl;
  }

  async uploadContentVideo(
    video: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await this.post<{
      success: boolean;
      videoUrl: string;
      publicId: string;
    }>("/api/content/upload/video", formData, {
      skipAuth: false,
      timeout: 5 * 60 * 1000, // 5 minutes for large video uploads
      onUploadProgress: onProgress
        ? (event) => {
            const progress = event.total
              ? Math.round((event.loaded * 100) / event.total)
              : 0;
            onProgress(progress);
          }
        : undefined,
    });

    return response.videoUrl;
  }
}

export const contentService = new ContentService();
