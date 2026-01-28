"use client";

import { usePermissions } from "@/contexts/PermissionContext";
import { PermissionResource, PermissionAction } from "@/typings/permissions";
import NotAllowed from "./NotAllowed";
import MainLoader from "./MainLoader";

interface PermissionGateProps {
  children: React.ReactNode;
  resource: PermissionResource;
  action: PermissionAction;
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

/**
 * PermissionGate component that conditionally renders children
 * based on user permissions.
 *
 * Usage:
 * <PermissionGate resource={PermissionResource.CONTENT} action={PermissionAction.READ}>
 *   <ContentPage />
 * </PermissionGate>
 */
export default function PermissionGate({
  children,
  resource,
  action,
  fallback,
  showLoader = true,
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading && showLoader) {
    return <MainLoader message="Checking permissions..." />;
  }

  if (!hasPermission(resource, action)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <NotAllowed
        title="Access Denied"
        message={`You don't have permission to ${action} ${resource.replace("_", " ")}. Please contact your administrator.`}
      />
    );
  }

  return <>{children}</>;
}

/**
 * Hook-based permission check for conditional rendering
 */
export function useCanAccess(
  resource: PermissionResource,
  action: PermissionAction
): { canAccess: boolean; isLoading: boolean } {
  const { hasPermission, isLoading } = usePermissions();
  return {
    canAccess: hasPermission(resource, action),
    isLoading,
  };
}
