"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getUser, logout } from "@/utils/auth";
import { Role, UserType } from "@/typings/auth";
import { usePermissions } from "@/contexts/PermissionContext";
import {
  PermissionResource,
  PermissionAction,
  NAVIGATION_PERMISSIONS,
} from "@/typings/permissions";
import NotAllowed from "../components/NotAllowed";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  resource: PermissionResource;
  action: PermissionAction;
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "📊",
    resource: PermissionResource.ANALYTICS,
    action: PermissionAction.READ,
  },
  {
    name: "Content",
    href: "/dashboard/content",
    icon: "📄",
    resource: PermissionResource.CONTENT,
    action: PermissionAction.READ,
  },
  {
    name: "Collections",
    href: "/dashboard/collections",
    icon: "📁",
    resource: PermissionResource.CONTENT,
    action: PermissionAction.READ,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: "📈",
    resource: PermissionResource.ANALYTICS,
    action: PermissionAction.READ,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "⚙️",
    resource: PermissionResource.SETTINGS,
    action: PermissionAction.READ,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { hasPermission, isLoading } = usePermissions();

  const user = getUser();

  // Filter navigation items based on permissions
  const filteredNavigation = useMemo(() => {
    // Admin users see all navigation items
    if (user?.userType === UserType.ADMIN) {
      return navigationItems;
    }

    // Company users see items based on their permissions
    return navigationItems.filter((item) =>
      hasPermission(item.resource, item.action)
    );
  }, [hasPermission, user?.userType]);

  // Check if user has access to current page
  const currentPagePermission = useMemo(() => {
    // Find the most specific matching route
    const sortedRoutes = Object.keys(NAVIGATION_PERMISSIONS).sort(
      (a, b) => b.length - a.length
    );

    for (const route of sortedRoutes) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        return NAVIGATION_PERMISSIONS[route];
      }
    }
    return null;
  }, [pathname]);

  const hasCurrentPageAccess = useMemo(() => {
    // Admin users have access to everything
    if (user?.userType === UserType.ADMIN) {
      return true;
    }

    // If no specific permission is required for this route, allow access
    if (!currentPagePermission) {
      return true;
    }

    return hasPermission(
      currentPagePermission.resource,
      currentPagePermission.action
    );
  }, [currentPagePermission, hasPermission, user?.userType]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Check if user is authorized to access dashboard
  if (user?.role === Role.USER && user?.userType === UserType.USER) {
    return <NotAllowed showDashboardLink={false} />;
  }

  // Get user initials for avatar
  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          {sidebarOpen && (
            <Image
              src="/assets/logo_trans.png"
              alt="DIT Tech Digital Studios"
              width={300}
              height={300}
              className="w-30 h-30"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="text-xl">{sidebarOpen ? "←" : "→"}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            filteredNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })
          )}

          {filteredNavigation.length === 0 && !isLoading && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
              No accessible pages
            </p>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {userInitials}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasCurrentPageAccess ? (
          children
        ) : (
          <NotAllowed
            title="Access Denied"
            message="You don't have permission to access this page. Please contact your administrator."
            showDashboardLink={filteredNavigation.length > 0}
          />
        )}
      </div>
    </div>
  );
}
