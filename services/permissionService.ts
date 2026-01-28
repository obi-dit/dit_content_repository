import { HttpService } from "./httpService";
import { UserPermission } from "@/typings/permissions";

export class PermissionService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Get all permissions for the currently logged-in user
   * Only works for company_user type
   */
  async getUserPermissions(): Promise<UserPermission[]> {
    return this.get<UserPermission[]>("/api/permissions/user/permissions");
  }
}

export const permissionService = new PermissionService();
