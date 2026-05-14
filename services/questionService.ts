import { HttpService } from "./httpService";
import type { SubscriberQuestion } from "@/typings/subscriber-dashboard";

export interface AdminQuestion {
  id: string;
  text: string;
  status: SubscriberQuestion["status"];
  submittedAt: string;
  askedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminPodcastQuestionGroup {
  podcast: {
    id: string;
    title: string;
    isLive: boolean;
    createdAt: string;
    videoUrl?: string;
    imageUrl?: string;
    description?: string;
  };
  questions: AdminQuestion[];
}

export class QuestionService extends HttpService {
  async createQuestion(payload: {
    question: string;
    podcastId: string;
  }): Promise<SubscriberQuestion> {
    return this.post<SubscriberQuestion>("/api/questions", payload);
  }

  async listMyQuestions(): Promise<SubscriberQuestion[]> {
    return this.get<SubscriberQuestion[]>("/api/questions/mine");
  }

  async listQuestionsByPodcast(): Promise<AdminPodcastQuestionGroup[]> {
    return this.get<AdminPodcastQuestionGroup[]>("/api/questions/admin/by-podcast");
  }

  async updateQuestionStatus(
    id: string,
    status: SubscriberQuestion["status"],
  ): Promise<{ id: string; status: SubscriberQuestion["status"] }> {
    return this.patch<{ id: string; status: SubscriberQuestion["status"] }>(
      `/api/questions/admin/${id}/status`,
      { status },
    );
  }
}

export const questionService = new QuestionService();
