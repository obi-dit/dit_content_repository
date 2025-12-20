"use client";

import { useState, useEffect } from "react";
import { User } from "./UserSidebar";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "content" | "users" | "settings" | "analytics";
}

interface UserPermissionsProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onUpdatePermissions: (userId: string, permissions: Permission[]) => void;
}

const defaultPermissions: Permission[] = [
  {
    id: "view_content",
    name: "View Content",
    description: "Can view all content items",
    enabled: false,
    category: "content",
  },
  {
    id: "create_content",
    name: "Create Content",
    description: "Can create new content items",
    enabled: false,
    category: "content",
  },
  {
    id: "edit_content",
    name: "Edit Content",
    description: "Can edit existing content items",
    enabled: false,
    category: "content",
  },
  {
    id: "delete_content",
    name: "Delete Content",
    description: "Can delete content items",
    enabled: false,
    category: "content",
  },
  {
    id: "publish_content",
    name: "Publish Content",
    description: "Can publish content items",
    enabled: false,
    category: "content",
  },
  {
    id: "view_users",
    name: "View Users",
    description: "Can view user list",
    enabled: false,
    category: "users",
  },
  {
    id: "manage_users",
    name: "Manage Users",
    description: "Can add, edit, and remove users",
    enabled: false,
    category: "users",
  },
  {
    id: "manage_permissions",
    name: "Manage Permissions",
    description: "Can modify user permissions",
    enabled: false,
    category: "users",
  },
  {
    id: "view_analytics",
    name: "View Analytics",
    description: "Can view analytics and reports",
    enabled: false,
    category: "analytics",
  },
  {
    id: "manage_settings",
    name: "Manage Settings",
    description: "Can modify system settings",
    enabled: false,
    category: "settings",
  },
];

const rolePermissions: Record<string, string[]> = {
  admin: [
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
  editor: [
    "view_content",
    "create_content",
    "edit_content",
    "publish_content",
    "view_analytics",
  ],
  viewer: ["view_content", "view_analytics"],
};

export default function UserPermissions({
  user,
  onUpdateUser,
  onUpdatePermissions,
}: UserPermissionsProps) {
  const [permissions, setPermissions] = useState<Permission[]>(() => {
    if (!user) return defaultPermissions;
    const userPerms = rolePermissions[user.role] || [];
    return defaultPermissions.map((perm) => ({
      ...perm,
      enabled: userPerms.includes(perm.id),
    }));
  });

  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [isEditing, setIsEditing] = useState(false);

  // Update permissions when user changes
  useEffect(() => {
    if (user) {
      // Only update if it's a different user
      if (!editedUser || editedUser.id !== user.id) {
        setEditedUser(user);
        const userPerms = rolePermissions[user.role] || [];
        setPermissions(
          defaultPermissions.map((perm) => ({
            ...perm,
            enabled: userPerms.includes(perm.id),
          }))
        );
        setIsEditing(false);
      }
    } else {
      // Reset when user is null
      setEditedUser(null);
      setIsEditing(false);
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (newRole: User["role"]) => {
    if (!editedUser) return;
    const updatedUser = { ...editedUser, role: newRole };
    setEditedUser(updatedUser);
    const userPerms = rolePermissions[newRole] || [];
    const updatedPerms = defaultPermissions.map((perm) => ({
      ...perm,
      enabled: userPerms.includes(perm.id),
    }));
    setPermissions(updatedPerms);
  };

  const handleStatusChange = (newStatus: User["status"]) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, status: newStatus });
  };

  const togglePermission = (permissionId: string) => {
    if (!editedUser || editedUser.role === "admin") return; // Prevent modifying admin permissions directly
    const updatedPerms = permissions.map((perm) =>
      perm.id === permissionId ? { ...perm, enabled: !perm.enabled } : perm
    );
    setPermissions(updatedPerms);
  };

  const handleSave = () => {
    if (!editedUser) return;
    onUpdateUser(editedUser);
    onUpdatePermissions(editedUser.id, permissions);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!user) return;
    setEditedUser(user);
    const userPerms = rolePermissions[user.role] || [];
    setPermissions(
      defaultPermissions.map((perm) => ({
        ...perm,
        enabled: userPerms.includes(perm.id),
      }))
    );
    setIsEditing(false);
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

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!user || !editedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-2">👤</p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Select a user to manage their permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* User Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {editedUser.name}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {editedUser.email}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="p-6 space-y-6">
        {/* User Information */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            User Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Role
              </label>
              {isEditing ? (
                <select
                  value={editedUser.role}
                  onChange={(e) =>
                    handleRoleChange(e.target.value as User["role"])
                  }
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 capitalize">
                  {editedUser.role}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Status
              </label>
              {isEditing ? (
                <select
                  value={editedUser.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as User["status"])
                  }
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 capitalize">
                  {editedUser.status}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Permissions
          </h3>
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                  <span>{getCategoryIcon(category)}</span>
                  <span className="capitalize">{category}</span>
                </h4>
                <div className="space-y-2">
                  {perms.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-zinc-900 dark:text-zinc-50">
                            {permission.name}
                          </span>
                          {permission.enabled && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              Enabled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {permission.description}
                        </p>
                      </div>
                      {isEditing && editedUser.role !== "admin" && (
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={permission.enabled}
                            onChange={() => togglePermission(permission.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
