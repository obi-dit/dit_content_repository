import { HttpService } from "./httpService";

export interface DashboardStats {
  totalContent: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
  publishedChange?: string;
  viewsChange?: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  item: string;
  time: string;
  icon: string;
  contentId?: string;
  userId?: string;
}

export interface RecentContent {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  views: number;
  author: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentContent: RecentContent[];
  recentActivity: RecentActivity[];
}

export class DashboardService extends HttpService {
  constructor() {
    super();
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.get<DashboardData>("/api/dashboard");
  }
}

export const dashboardService = new DashboardService();
