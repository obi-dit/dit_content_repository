"use client";

import { useMemo } from "react";
import { usePermissions } from "@/contexts/PermissionContext";
import { PermissionResource, PermissionAction } from "@/typings/permissions";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  id: string;
  name: string;
  icon: string;
  resource: PermissionResource;
  action: PermissionAction;
}

const settingsNavigation: NavItem[] = [
  {
    id: "users",
    name: "Users",
    icon: "👥",
    resource: PermissionResource.COMPANY_USER,
    action: PermissionAction.READ,
  },
  {
    id: "preferences",
    name: "Preferences",
    icon: "⚙️",
    resource: PermissionResource.SETTINGS,
    action: PermissionAction.READ,
  },
  {
    id: "roles_permissions",
    name: "Roles & Permissions",
    icon: "🔐",
    resource: PermissionResource.ROLE,
    action: PermissionAction.READ,
  },
  {
    id: "groups",
    name: "Groups",
    icon: "👤",
    resource: PermissionResource.SETTINGS,
    action: PermissionAction.READ,
  },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const { hasPermission, isLoading } = usePermissions();

  // Filter navigation based on permissions
  const filteredNavigation = useMemo(() => {
    return settingsNavigation.filter((item) =>
      hasPermission(item.resource, item.action)
    );
  }, [hasPermission]);

  return (
    <div className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Settings
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your system settings
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredNavigation.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            No accessible sections
          </p>
        ) : (
          filteredNavigation.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })
        )}
      </nav>
    </div>
  );
}
