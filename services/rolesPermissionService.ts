import { HttpService } from "./httpService";

export interface Permission {
  _id: string;
  name: string;
  description: string;
  action: "create" | "read" | "update" | "delete" | "manage";
  resource:
    | "content"
    | "user"
    | "company_user"
    | "company"
    | "permission"
    | "role"
    | "analytics"
    | "settings";
  isActive: boolean;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[] | string[]; // Can be populated or just IDs
  isActive: boolean;
  isDefault: boolean;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissionIds?: string[];
  isActive?: boolean;
  companyId?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
  isActive?: boolean;
}

export interface AssignPermissionsDto {
  permissionIds: string[];
}

export default class RolesPermissionService extends HttpService {
  constructor() {
    super();
  }

  // Permission endpoints
  async getPermissions(): Promise<Permission[]> {
    return this.get<Permission[]>("/api/permissions");
  }

  async getPermissionById(id: string): Promise<Permission> {
    return this.get<Permission>(`/api/permissions/${id}`);
  }

  async getPermissionsByResource(
    resource: Permission["resource"]
  ): Promise<Permission[]> {
    return this.get<Permission[]>(`/api/permissions/resource/${resource}`);
  }

  async getPermissionsByAction(
    action: Permission["action"]
  ): Promise<Permission[]> {
    return this.get<Permission[]>(`/api/permissions/action/${action}`);
  }

  // Role endpoints
  async getRoles(companyId?: string): Promise<Role[]> {
    const query = companyId ? `?companyId=${companyId}` : "";
    return this.get<Role[]>(`/api/permissions/roles${query}`);
  }

  async getRoleById(id: string): Promise<Role> {
    return this.get<Role>(`/api/permissions/roles/${id}`);
  }

  async createRole(role: CreateRoleDto): Promise<Role> {
    return this.post<Role>("/api/permissions/roles", role);
  }

  async updateRole(id: string, role: UpdateRoleDto): Promise<Role> {
    return this.put<Role>(`/api/permissions/roles/${id}`, role);
  }

  async deleteRole(id: string): Promise<void> {
    return this.delete(`/api/permissions/roles/${id}`);
  }

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    return this.post<Role>(`/api/permissions/roles/${roleId}/permissions`, {
      permissionIds,
    });
  }

  async checkPermission(
    roleId: string,
    resource: Permission["resource"],
    action: Permission["action"]
  ): Promise<{ hasPermission: boolean }> {
    return this.get<{ hasPermission: boolean }>(
      `/api/permissions/roles/${roleId}/check?resource=${resource}&action=${action}`
    );
  }
}

export const rolesPermissionService = new RolesPermissionService();
