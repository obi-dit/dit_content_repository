import { HttpService } from "./httpService";

export interface Content {
  title: string;
  description: string;
  content: string;
  type: string;
  status: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default class ContentService extends HttpService {
  constructor() {
    super();
  }

  async createContent(content: Content) {
    return this.post("/api/content", content);
  }

  async getAllContents(): Promise<Content[]> {
    return this.get("/api/content");
  }

  async getContentById(id: string): Promise<Content & { _id: string; createdAt: string; updatedAt: string; views: number; userId: string }> {
    return this.get(`/api/content/${id}`);
  }

  async updateContent(id: string, content: Content) {
    return this.put(`/api/content/${id}`, content);
  }

  async uploadContentImage(image: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await this.post<{
      success: boolean;
      imageUrl: string;
      publicId: string;
    }>("/api/content/upload/image", formData, {
      headers: {}, // Let browser set Content-Type with boundary for FormData
      skipAuth: false,
    });

    return response.imageUrl;
  }

  async uploadContentVideo(video: File): Promise<string> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await this.post<{
      success: boolean;
      videoUrl: string;
      publicId: string;
    }>("/api/content/upload/video", formData, {
      headers: {}, // Let browser set Content-Type with boundary for FormData
      skipAuth: false,
    });

    return response.videoUrl;
  }
}

export const contentService = new ContentService();
