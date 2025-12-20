"use client";

import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  avatar?: string;
}

interface UserSidebarProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
}

export default function UserSidebar({
  users,
  selectedUserId,
  onSelectUser,
}: UserSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
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
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[role as keyof typeof styles] || styles.viewer
        }`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="w-80 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Users
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </span>
        </div>

        {/* Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No users found
          </div>
        ) : (
          <div className="p-2">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserId === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left mb-1 ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
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

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p
                        className={`font-medium text-sm truncate ${
                          isSelected
                            ? "text-white dark:text-zinc-900"
                            : "text-zinc-900 dark:text-zinc-50"
                        }`}
                      >
                        {user.name}
                      </p>
                      {user.status === "active" && (
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        isSelected
                          ? "text-zinc-200 dark:text-zinc-600"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {user.email}
                    </p>
                    <div className="mt-1">{getRoleBadge(user.role)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Add User Button */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <button className="w-full px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm">
          + Add User
        </button>
      </div>
    </div>
  );
}
