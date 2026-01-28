"use client";

import { useState, FormEvent, useEffect } from "react";
import Modal from "./Modal";
import { User } from "./settings/Users";

import { settingsService } from "@/services/settingsService";
import { rolesPermissionService, Role } from "@/services/rolesPermissionService";
import { toast } from "react-toastify";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, "id" | "date_created">) => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Fetch roles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const fetchedRoles = await rolesPermissionService.getRoles();
      setRoles(fetchedRoles.filter((role) => role.isActive));
      
      // Set default role if available
      if (fetchedRoles.length > 0 && !formData.roleId) {
        const defaultRole = fetchedRoles.find((r) => r.isDefault) || fetchedRoles[0];
        setFormData((prev) => ({ ...prev, roleId: defaultRole._id }));
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await settingsService.createCompanyUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roleId: formData.roleId,
      });
      toast.success("User added successfully");
      
      // Call onAdd with user data for UI update
      const selectedRole = roles.find((r) => r._id === formData.roleId);
      onAdd({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: selectedRole?.name || "viewer",
      });
      
      handleClose();
    } catch (error) {
      toast.error("Error adding user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      roleId: roles.length > 0 ? (roles.find((r) => r.isDefault)?._id || roles[0]._id) : "",
    });
    setErrors({});
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500"
            } bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2`}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500"
            } bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2`}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500"
            } bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label
            htmlFor="roleId"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            disabled={isLoadingRoles}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.roleId
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500"
            } bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoadingRoles ? (
              <option value="">Loading roles...</option>
            ) : roles.length === 0 ? (
              <option value="">No roles available</option>
            ) : (
              <>
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                    {role.isDefault ? " (Default)" : ""}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.roleId}
            </p>
          )}
          {!isLoadingRoles && formData.roleId && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {roles.find((r) => r._id === formData.roleId)?.description || ""}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isLoadingRoles || roles.length === 0}
          >
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
