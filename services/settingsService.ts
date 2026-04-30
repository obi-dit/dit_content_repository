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
  roleId?: string;
  roleName?: string;
  additionalPermissionIds?: string[];
  revokedPermissionIds?: string[];
}

export interface UpdateCompanyUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: string;
  permissionIds?: string[];
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

export type AgeVerificationStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "declined";

export interface SubscriberUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  isActive: boolean;
  /** True when the user has at least one non-cancelled lounge payment record */
  hasPaid?: boolean;
  dateOfBirth?: string;
  driversLicenseUrl?: string;
  ageVerificationStatus: AgeVerificationStatus;
  ageVerificationDeclineReason?: string;
  ageVerificationReviewedAt?: string;
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

  async getSubscribers() {
    return this.get<{ subscribers: SubscriberUser[]; count: number }>(
      "/api/users/subscribers"
    );
  }

  async updateSubscriberAgeVerification(
    id: string,
    data: {
      status: Extract<AgeVerificationStatus, "approved" | "declined">;
      declineReason?: string;
    }
  ) {
    return this.patch<{ subscriber: SubscriberUser }>(
      `/api/users/subscribers/${id}/age-verification`,
      data
    );
  }
}

export const settingsService = new SettingsService();
