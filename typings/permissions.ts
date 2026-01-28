// Permission types matching the API
export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}

export enum PermissionResource {
  CONTENT = "content",
  USER = "user",
  COMPANY_USER = "company_user",
  COMPANY = "company",
  PERMISSION = "permission",
  ROLE = "role",
  ANALYTICS = "analytics",
  SETTINGS = "settings",
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
}

// Navigation permission mapping
export const NAVIGATION_PERMISSIONS: Record<
  string,
  { resource: PermissionResource; action: PermissionAction }
> = {
  "/dashboard": { resource: PermissionResource.ANALYTICS, action: PermissionAction.READ },
  "/dashboard/content": { resource: PermissionResource.CONTENT, action: PermissionAction.READ },
  "/dashboard/collections": { resource: PermissionResource.CONTENT, action: PermissionAction.READ },
  "/dashboard/analytics": { resource: PermissionResource.ANALYTICS, action: PermissionAction.READ },
  "/dashboard/settings": { resource: PermissionResource.SETTINGS, action: PermissionAction.READ },
  "/dashboard/settings/users": { resource: PermissionResource.COMPANY_USER, action: PermissionAction.READ },
  "/dashboard/settings/roles": { resource: PermissionResource.ROLE, action: PermissionAction.READ },
};

// Helper to build permission name from resource and action
export function buildPermissionName(
  resource: PermissionResource,
  action: PermissionAction
): string {
  return `${resource}.${action}`;
}

// Helper to parse permission name into resource and action
export function parsePermissionName(name: string): {
  resource: PermissionResource;
  action: PermissionAction;
} | null {
  const [resource, action] = name.split(".");
  if (
    Object.values(PermissionResource).includes(resource as PermissionResource) &&
    Object.values(PermissionAction).includes(action as PermissionAction)
  ) {
    return {
      resource: resource as PermissionResource,
      action: action as PermissionAction,
    };
  }
  return null;
}
