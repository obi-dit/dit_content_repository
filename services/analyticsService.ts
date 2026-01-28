import { HttpService } from "./httpService";

export interface ContentByStatus {
  status: string;
  count: number;
}

export interface ContentByType {
  type: string;
  count: number;
}

export interface ViewsOverTime {
  date: string;
  views: number;
}

export interface TopContent {
  id: string;
  title: string;
  views: number;
  status: string;
  author: string;
}

export interface ContentByAuthor {
  author: string;
  authorId: string;
  count: number;
  totalViews: number;
}

export interface AnalyticsData {
  contentByStatus: ContentByStatus[];
  contentByType: ContentByType[];
  viewsOverTime: ViewsOverTime[];
  topContent: TopContent[];
  contentByAuthor: ContentByAuthor[];
  totalStats: {
    totalContent: number;
    totalViews: number;
    averageViews: number;
    publishedCount: number;
    draftCount: number;
  };
}

export class AnalyticsService extends HttpService {
  constructor() {
    super();
  }

  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    return this.get<AnalyticsData>(`/api/analytics?days=${days}`);
  }
}

export const analyticsService = new AnalyticsService();
