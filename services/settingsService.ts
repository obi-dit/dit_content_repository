import { HttpService } from "./httpService";

export interface CompanyUser {
  firstName: string;
  lastName: string;
  email: string;
  role?: "admin" | "editor" | "viewer";
}

export interface CompanyUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  date_created: string;
  role: "admin" | "editor" | "viewer";
}

export class SettingsService extends HttpService {
  constructor() {
    super();
  }

  async createCompanyUser(companyUser: CompanyUser) {
    return this.post("/api/company-users", { ...companyUser, role: undefined });
  }

  async getCompanyUsers() {
    return this.get<CompanyUserProfile[]>("/api/company-users");
  }
}

export const settingsService = new SettingsService();
