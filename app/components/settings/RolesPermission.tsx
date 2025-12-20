"use client";

import { useState, useEffect } from "react";
import Modal from "../Modal";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "content" | "users" | "settings" | "analytics";
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const allPermissions: Permission[] = [
  {
    id: "view_content",
    name: "View Content",
    description: "Can view all content items",
    category: "content",
  },
  {
    id: "create_content",
    name: "Create Content",
    description: "Can create new content items",
    category: "content",
  },
  {
    id: "edit_content",
    name: "Edit Content",
    description: "Can edit existing content items",
    category: "content",
  },
  {
    id: "delete_content",
    name: "Delete Content",
    description: "Can delete content items",
    category: "content",
  },
  {
    id: "publish_content",
    name: "Publish Content",
    description: "Can publish content items",
    category: "content",
  },
  {
    id: "view_users",
    name: "View Users",
    description: "Can view user list",
    category: "users",
  },
  {
    id: "manage_users",
    name: "Manage Users",
    description: "Can add, edit, and remove users",
    category: "users",
  },
  {
    id: "manage_permissions",
    name: "Manage Permissions",
    description: "Can modify user permissions",
    category: "users",
  },
  {
    id: "view_analytics",
    name: "View Analytics",
    description: "Can view analytics and reports",
    category: "analytics",
  },
  {
    id: "manage_settings",
    name: "Manage Settings",
    description: "Can modify system settings",
    category: "settings",
  },
];

// Mock initial roles data - replace with API calls
const initialRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: [
      "view_content",
      "create_content",
      "edit_content",
      "delete_content",
      "publish_content",
      "view_users",
      "manage_users",
      "manage_permissions",
      "view_analytics",
      "manage_settings",
    ],
    userCount: 3,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can create, edit, and publish content",
    permissions: [
      "view_content",
      "create_content",
      "edit_content",
      "publish_content",
      "view_analytics",
    ],
    userCount: 8,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to content and analytics",
    permissions: ["view_content", "view_analytics"],
    userCount: 15,
  },
];

export default function RolesPermission() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const getRoleBadge = (roleName: string) => {
    const styles = {
      admin:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      editor:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      viewer:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[roleName.toLowerCase() as keyof typeof styles] ||
          "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300"
        }`}
      >
        {roleName}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "content":
        return "📄";
      case "users":
        return "👥";
      case "analytics":
        return "📈";
      case "settings":
        return "⚙️";
      default:
        return "📋";
    }
  };

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions([...role.permissions]);
    setIsEditModalOpen(true);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (selectedRole?.id === "admin") {
      // Prevent removing all permissions from admin
      if (
        editedPermissions.length === 1 &&
        editedPermissions.includes(permissionId)
      ) {
        return;
      }
    }

    setEditedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;

    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === selectedRole.id
          ? { ...role, permissions: editedPermissions }
          : role
      )
    );

    // TODO: Implement API call to save permissions
    console.log(
      "Saving permissions for role:",
      selectedRole.id,
      editedPermissions
    );

    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, "_"),
      name: newRoleName,
      description: newRoleDescription || "Custom role",
      permissions: [],
      userCount: 0,
    };

    setRoles([...roles, newRole]);
    setNewRoleName("");
    setNewRoleDescription("");
    setIsCreatingRole(false);

    // TODO: Implement API call to create role
    console.log("Creating new role:", newRole);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.id === "admin") {
      alert("Cannot delete the admin role");
      return;
    }

    if (role.userCount > 0) {
      if (
        !confirm(
          `This role is assigned to ${role.userCount} user(s). Are you sure you want to delete it?`
        )
      ) {
        return;
      }
    } else {
      if (
        !confirm(`Are you sure you want to delete the "${role.name}" role?`)
      ) {
        return;
      }
    }

    setRoles(roles.filter((r) => r.id !== role.id));

    // TODO: Implement API call to delete role
    console.log("Deleting role:", role.id);
  };

  const getPermissionCount = (role: Role) => {
    return role.permissions.length;
  };

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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Users
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
                      colSpan={5}
                      className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No roles found. Create your first role to get started.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr
                      key={role.id}
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
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {role.userCount} user{role.userCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                          >
                            Edit Permissions
                          </button>
                          {role.id !== "admin" && (
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
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span className="capitalize">{category}</span>
                  </h4>
                  <div className="space-y-2">
                    {perms.map((permission) => {
                      const isEnabled = editedPermissions.includes(
                        permission.id
                      );
                      const isDisabled =
                        selectedRole.id === "admin" &&
                        permission.id === "view_content" &&
                        editedPermissions.length === 1 &&
                        isEnabled;

                      return (
                        <div
                          key={permission.id}
                          className="flex items-start justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                {permission.name}
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
                                handleTogglePermission(permission.id)
                              }
                              disabled={isDisabled}
                              className="sr-only peer"
                              aria-label={`Toggle ${permission.name} permission`}
                            />
                            <div
                              className={`w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600 ${
                                isDisabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
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
