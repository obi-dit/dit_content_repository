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

// Regular User interfaces
export interface CreateRegularUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegularUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRegularUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class SettingsService extends HttpService {
  constructor() {
    super();
  }

  // Company User methods
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

  // Regular User methods
  async createRegularUser(user: CreateRegularUserDto) {
    return this.post("/api/users", user);
  }

  async getRegularUsers() {
    return this.get<{ users: RegularUser[]; count: number }>("/api/users");
  }

  async getRegularUserById(id: string) {
    return this.get<{ user: RegularUser }>(`/api/users/${id}`);
  }

  async updateRegularUser(id: string, data: UpdateRegularUserDto) {
    return this.patch(`/api/users/${id}`, data);
  }

  async deleteRegularUser(id: string) {
    return this.delete(`/api/users/${id}`);
  }
}

export const settingsService = new SettingsService();
