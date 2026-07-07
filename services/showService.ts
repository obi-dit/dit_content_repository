import { HttpService } from "./httpService";

import { Podcast } from "@/typings/podcast";

export interface Show {
  id: string;
  title: string;
  description: string;
  category: string;
  episodes: number;
  icon: string;
  imageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
}

export interface ShowWithPodcasts extends Omit<Show, "isActive"> {
  podcasts: Podcast[];
}

class ShowService extends HttpService {
  async getShows(): Promise<Show[]> {
    const response = await this.get<{ shows: Show[] }>("/api/shows", {
      skipAuth: true,
    });
    return response.shows;
  }

  async getShowsWithPodcasts(): Promise<ShowWithPodcasts[]> {
    const response = await this.get<{ shows: ShowWithPodcasts[] }>(
      "/api/shows/with-podcasts",
    );
    return response.shows;
  }
}

export const showService = new ShowService();
