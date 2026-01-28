import { HttpService } from "./httpService";

export interface CreateCompanyUserDto {
  firstName: string;
  lastName: string;
  email: string;
  roleId?: string;
}

export interface CompanyUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  date_created: string;
  role: string;
  userType?: string;
}

export interface UpdateCompanyUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: string;
}

export class SettingsService extends HttpService {
  constructor() {
    super();
  }

  async createCompanyUser(companyUser: CreateCompanyUserDto) {
    return this.post("/api/company-users", companyUser);
  }

  async getCompanyUsers() {
    return this.get<CompanyUserProfile[]>("/api/company-users");
  }

  async getCompanyUserById(id: string) {
    return this.get<CompanyUserProfile>(`/api/company-users/${id}`);
  }

  async updateCompanyUser(id: string, data: UpdateCompanyUserDto) {
    return this.put(`/api/company-users/${id}`, data);
  }

  async deleteCompanyUser(id: string) {
    return this.delete(`/api/company-users/${id}`);
  }
}

export const settingsService = new SettingsService();
