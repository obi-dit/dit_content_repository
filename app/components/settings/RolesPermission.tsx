"use client";

import { useState, useEffect } from "react";
import Modal from "../Modal";
import {
  rolesPermissionService,
  Permission,
  Role,
  CreateRoleDto,
} from "@/services/rolesPermissionService";

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

export default function RolesPermission() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [rolesData, permissionsData] = await Promise.all([
        rolesPermissionService.getRoles(),
        rolesPermissionService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load roles and permissions"
      );
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<Permission["resource"], Permission[]>);

  const getRoleBadge = (roleName: string) => {
    const styles: Record<string, string> = {
      Admin:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      "Content Editor":
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      Editor:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      Viewer:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[roleName] ||
          "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300"
        }`}
      >
        {roleName}
      </span>
    );
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    // Extract permission IDs from role (handle both populated and non-populated)
    const permissionIds =
      role.permissions && Array.isArray(role.permissions)
        ? role.permissions.map((p) =>
            typeof p === "string" ? p : p._id || p.toString()
          )
        : [];
    setSelectedPermissionIds(permissionIds);
    setIsEditModalOpen(true);
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      setError(null);
      await rolesPermissionService.assignPermissionsToRole(
        selectedRole._id,
        selectedPermissionIds
      );
      await loadData(); // Reload data
      setIsEditModalOpen(false);
      setSelectedRole(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save permissions"
      );
      console.error("Error saving permissions:", err);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      setError(null);
      const newRole: CreateRoleDto = {
        name: newRoleName,
        description: newRoleDescription || "Custom role",
        permissionIds: [],
        isActive: true,
      };

      await rolesPermissionService.createRole(newRole);
      await loadData(); // Reload data
      setNewRoleName("");
      setNewRoleDescription("");
      setIsCreatingRole(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role");
      console.error("Error creating role:", err);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.name.toLowerCase() === "admin") {
      alert("Cannot delete the admin role");
      return;
    }

    if (!confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      return;
    }

    try {
      setError(null);
      await rolesPermissionService.deleteRole(role._id);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role");
      console.error("Error deleting role:", err);
      alert("Failed to delete role. Please try again.");
    }
  };

  const getPermissionCount = (role: Role): number => {
    if (!role.permissions || !Array.isArray(role.permissions)) return 0;
    return role.permissions.length;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Loading roles and permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Roles & Permissions
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Manage system-wide roles and their permissions
            </p>
          </div>
          <button
            onClick={() => setIsCreatingRole(true)}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            + Create Role
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
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          {/* Roles Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {roles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No roles found. Create your first role to get started.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr
                      key={role._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getRoleBadge(role.name)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {role.description}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {getPermissionCount(role)} permission
                          {getPermissionCount(role) !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!role.isDefault && (
                            <button
                              onClick={() => handleEditRole(role)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                            >
                              Edit Permissions
                            </button>
                          )}
                          {role.name.toLowerCase() !== "admin" && (
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                              title="Delete Role"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
        }}
        title={`Edit Permissions - ${selectedRole?.name || ""}`}
        size="xl"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {selectedRole.description}
              </p>
            </div>

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

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreatingRole}
        onClose={() => {
          setIsCreatingRole(false);
          setNewRoleName("");
          setNewRoleDescription("");
        }}
        title="Create New Role"
        size="md"
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Role Name *
            </label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g., Moderator, Contributor"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              placeholder="Describe the role's purpose and responsibilities"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => {
                setIsCreatingRole(false);
                setNewRoleName("");
                setNewRoleDescription("");
                setError(null);
              }}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Role
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
