"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import MainLoader from "@/app/components/MainLoader";
import {
  settingsService,
  CompanyUserProfile,
} from "@/services/settingsService";
import {
  rolesPermissionService,
  Role,
  Permission,
} from "@/services/rolesPermissionService";

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  date_created: string;
  role: string;
  userType?: string;
  userId?: string;
  companyUserId?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "roles" | "permissions"
  >("details");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load user, roles, and permissions in parallel
      const [userData, rolesData, permissionsData] = await Promise.all([
        settingsService.getCompanyUserById(userId),
        rolesPermissionService.getRoles(),
        rolesPermissionService.getPermissions(),
      ]);

      // The API returns CompanyUserProfile
      setUser({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        date_created: userData.date_created,
        role: userData.role || "viewer",
        userType: userData.userType || "user",
      });

      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);

      // Set roles and permissions
      setRoles(rolesData);
      setPermissions(permissionsData);

      // Find and set the user's current role
      // Try to match by role name (case-insensitive)
      const roleName = userData.role || "viewer";
      const currentRole = rolesData.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      );
      if (currentRole) {
        setSelectedRoleId(currentRole._id);
        // If role has populated permissions, extract IDs
        if (currentRole.permissions && Array.isArray(currentRole.permissions)) {
          const permIds = currentRole.permissions.map((p) =>
            typeof p === "string" ? p : p._id || p.toString()
          );
          setSelectedPermissionIds(permIds);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
      console.error("Error loading user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      // Update company user with new details and role
      await settingsService.updateCompanyUser(user.id, {
        firstName,
        lastName,
        email,
        roleId: selectedRoleId || undefined,
      });

      // TODO: If you want to support individual permission assignment beyond roles,
      // you would need to add that functionality to the API

      router.push("/dashboard/settings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
      console.error("Error saving user:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (roleId: string) => {
    setSelectedRoleId(roleId);
    const selectedRole = roles.find((r) => r._id === roleId);
    if (selectedRole && selectedRole.permissions) {
      const permIds =
        selectedRole.permissions && Array.isArray(selectedRole.permissions)
          ? selectedRole.permissions.map((p) =>
              typeof p === "string" ? p : p._id || p.toString()
            )
          : [];
      setSelectedPermissionIds(permIds);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<Permission["resource"], Permission[]>);

  const resourceLabels: Record<Permission["resource"], string> = {
    content: "Content",
    user: "Users",
    company_user: "Company Users",
    company: "Company",
    permission: "Permissions",
    role: "Roles",
    analytics: "Analytics",
    settings: "Settings",
  };

  const actionLabels: Record<Permission["action"], string> = {
    create: "Create",
    read: "View",
    update: "Update",
    delete: "Delete",
    manage: "Manage",
  };

  const getResourceIcon = (resource: Permission["resource"]): string => {
    const icons: Record<Permission["resource"], string> = {
      content: "📄",
      user: "👥",
      company_user: "👤",
      company: "🏢",
      permission: "🔐",
      role: "🎭",
      analytics: "📈",
      settings: "⚙️",
    };
    return icons[resource] || "📋";
  };

  if (isLoading) {
    return <MainLoader message="Loading user details..." />;
  }

  if (error && !user) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href="/dashboard/settings"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              ←
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Edit User
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 dark:text-red-400">⚠️</span>
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        {/* Tabs */}
        <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
          <nav className="flex gap-4">
            {[
              { id: "details", label: "User Details" },
              { id: "roles", label: "Roles" },
              { id: "permissions", label: "Permissions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "details" | "roles" | "permissions")
                }
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          {/* User Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="dateCreated"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Date Created
                </label>
                <input
                  id="dateCreated"
                  type="text"
                  value={new Date(user.date_created).toLocaleDateString()}
                  disabled
                  aria-label="Date created (read-only)"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="roleSelect"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Assign Role
                </label>
                <select
                  id="roleSelect"
                  value={selectedRoleId}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  aria-label="Select role to assign"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name} {role.isDefault && "(Default)"}
                    </option>
                  ))}
                </select>
                {selectedRoleId && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {roles.find((r) => r._id === selectedRoleId)?.description}
                  </p>
                )}
              </div>

              {selectedRoleId && (
                <div className="mt-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    Role Permissions
                  </h4>
                  <div className="space-y-2">
                    {roles
                      .find((r) => r._id === selectedRoleId)
                      ?.permissions?.map((perm) => {
                        const permission =
                          typeof perm === "string"
                            ? permissions.find((p) => p._id === perm)
                            : perm;
                        if (!permission || typeof permission === "string")
                          return null;
                        return (
                          <div
                            key={permission._id}
                            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                          >
                            <span>✓</span>
                            <span>
                              {actionLabels[permission.action]}{" "}
                              {resourceLabels[permission.resource]}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Assign individual permissions to this user. These permissions
                will be in addition to any permissions granted by the assigned
                role.
              </p>

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                  <div key={resource}>
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                      <span>
                        {getResourceIcon(resource as Permission["resource"])}
                      </span>
                      <span>
                        {resourceLabels[resource as Permission["resource"]]}
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {perms.map((permission) => {
                        const isEnabled = selectedPermissionIds.includes(
                          permission._id
                        );

                        return (
                          <div
                            key={permission._id}
                            className="flex items-start justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                  {actionLabels[permission.action]}{" "}
                                  {resourceLabels[permission.resource]}
                                </span>
                                {isEnabled && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    Enabled
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {permission.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() =>
                                  handleTogglePermission(permission._id)
                                }
                                className="sr-only peer"
                                aria-label={`Toggle ${permission.name} permission`}
                              />
                              <div
                                className={`w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600`}
                              ></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
