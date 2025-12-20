"use client";

import { useState, useEffect } from "react";
import AddUserModal from "../AddUserModal";
import {
  CompanyUserProfile,
  settingsService,
} from "@/services/settingsService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  date_created: string;
  role: "admin" | "editor" | "viewer";
}

// Mock user data - replace with API calls
const initialUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    date_created: "2024-01-15",
    role: "admin",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    date_created: "2024-02-20",
    role: "editor",
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    date_created: "2024-03-10",
    role: "editor",
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Williams",
    email: "alice.williams@example.com",
    date_created: "2024-03-25",
    role: "viewer",
  },
  {
    id: "5",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.brown@example.com",
    date_created: "2024-04-05",
    role: "viewer",
  },
  {
    id: "6",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.prince@example.com",
    date_created: "2024-04-18",
    role: "editor",
  },
];

export default function Users() {
  const [users, setUsers] = useState<CompanyUserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

  useEffect(() => {
    settingsService.getCompanyUsers().then((users) => {
      setUsers(users);
    });
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    console.log("Edit user:", user);
    // Could open a modal or navigate to edit page
  };

  const handleDelete = (user: User) => {
    // TODO: Implement delete functionality with confirmation
    if (confirm(`Are you sure you want to delete ${user.firstName}?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
      console.log("Delete user:", user);
    }
  };

  const handleAddUser = (userData: Omit<User, "id" | "date_created">) => {
    // Generate a unique ID (find max ID and add 1, or use timestamp as fallback)
    const maxId = users.reduce((max, user) => {
      const userId = parseInt(user.id, 10);
      return !isNaN(userId) && userId > max ? userId : max;
    }, 0);
    const newUser: User = {
      ...userData,
      id: String(maxId + 1),
      date_created: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Users
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Manage all users and their permissions
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            + Add User
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          {/* Search and Filter */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  🔍
                </span>
              </div>
              {/* Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {user.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {user.firstName} {user.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {formatDate(user.date_created)}
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
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

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
}
