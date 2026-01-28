"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  UserPermission,
  PermissionResource,
  PermissionAction,
  buildPermissionName,
} from "@/typings/permissions";
import { getUser } from "@/utils/auth";
import { UserType } from "@/typings/auth";

const PERMISSIONS_KEY = "app_permissions";

interface PermissionContextType {
  permissions: UserPermission[];
  isLoading: boolean;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
  hasAnyPermission: (checks: { resource: PermissionResource; action: PermissionAction }[]) => boolean;
  setPermissions: (permissions: UserPermission[]) => void;
  clearPermissions: () => void;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissionsState] = useState<UserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load permissions from localStorage on mount
  useEffect(() => {
    const loadPermissions = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(PERMISSIONS_KEY);
        if (stored) {
          try {
            setPermissionsState(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse stored permissions:", e);
          }
        }
      }
      setIsLoading(false);
    };
    loadPermissions();
  }, []);

  const setPermissions = useCallback((newPermissions: UserPermission[]) => {
    setPermissionsState(newPermissions);
    if (typeof window !== "undefined") {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(newPermissions));
    }
  }, []);

  const clearPermissions = useCallback(() => {
    setPermissionsState([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PERMISSIONS_KEY);
    }
  }, []);

  const hasPermission = useCallback(
    (resource: PermissionResource, action: PermissionAction): boolean => {
      const user = getUser();
      
      // Admin users have all permissions
      if (user?.userType === UserType.ADMIN) {
        return true;
      }

      // Regular users (not company users) don't have dashboard permissions
      if (user?.userType === UserType.USER) {
        return false;
      }

      const permissionName = buildPermissionName(resource, action);
      const manageName = buildPermissionName(resource, PermissionAction.MANAGE);

      console.log("permissions", permissions);
      console.log("permissionName", permissionName);
      console.log("manageName", manageName);
      return permissions.some(
        (p) => p.name === permissionName || p.name === manageName
      );
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (checks: { resource: PermissionResource; action: PermissionAction }[]): boolean => {
      return checks.some((check) => hasPermission(check.resource, check.action));
    },
    [hasPermission]
  );

  const refreshPermissions = useCallback(async () => {
    const user = getUser();
    if (!user || user.userType !== UserType.COMPANY_USER) {
      return;
    }

    try {
      setIsLoading(true);
      const { permissionService } = await import("@/services/permissionService");
      const userPermissions = await permissionService.getUserPermissions();
      setPermissions(userPermissions);
    } catch (error) {
      console.error("Failed to refresh permissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setPermissions]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        isLoading,
        hasPermission,
        hasAnyPermission,
        setPermissions,
        clearPermissions,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}

// Hook to check a specific permission
export function useHasPermission(
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(resource, action);
}
