"use client";

import { useState, useEffect } from "react";
import SettingsSidebar from "../../components/SettingsSidebar";
import Users from "../../components/settings/Users";
import RegularUsers from "../../components/settings/RegularUsers";
import Preferences from "../../components/settings/Preferences";
import Permission from "../../components/settings/RolesPermission";
import Groups from "../../components/settings/Groups";
import NotAllowed from "../../components/NotAllowed";
import { usePermissions } from "@/contexts/PermissionContext";
import { PermissionResource, PermissionAction } from "@/typings/permissions";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("company-users");
  const { hasPermission } = usePermissions();

  // Permission checks for each section
  const canViewCompanyUsers = hasPermission(PermissionResource.COMPANY_USER, PermissionAction.READ);
  const canViewRegularUsers = hasPermission(PermissionResource.USER, PermissionAction.READ);
  const canViewRoles = hasPermission(PermissionResource.ROLE, PermissionAction.READ);
  const canViewSettings = hasPermission(PermissionResource.SETTINGS, PermissionAction.READ);

  // Set initial active section based on permissions
  useEffect(() => {
    if (!canViewCompanyUsers && canViewRegularUsers) {
      setActiveSection("regular-users");
    } else if (!canViewCompanyUsers && canViewSettings) {
      setActiveSection("preferences");
    } else if (!canViewCompanyUsers && canViewRoles) {
      setActiveSection("roles_permissions");
    }
  }, [canViewCompanyUsers, canViewRegularUsers, canViewSettings, canViewRoles]);

  const renderSection = () => {
    switch (activeSection) {
      case "company-users":
        return canViewCompanyUsers ? (
          <Users />
        ) : (
          <NotAllowed
            title="Company Users Access Denied"
            message="You don't have permission to view company users."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
      case "regular-users":
        return canViewRegularUsers ? (
          <RegularUsers />
        ) : (
          <NotAllowed
            title="Users Access Denied"
            message="You don't have permission to view users."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
      case "preferences":
        return canViewSettings ? (
          <Preferences />
        ) : (
          <NotAllowed
            title="Preferences Access Denied"
            message="You don't have permission to view preferences."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
      case "roles_permissions":
        return canViewRoles ? (
          <Permission />
        ) : (
          <NotAllowed
            title="Roles & Permissions Access Denied"
            message="You don't have permission to view roles and permissions."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
      case "groups":
        return canViewSettings ? (
          <Groups />
        ) : (
          <NotAllowed
            title="Groups Access Denied"
            message="You don't have permission to view groups."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
      default:
        return canViewCompanyUsers ? (
          <Users />
        ) : (
          <NotAllowed
            title="Access Denied"
            message="You don't have permission to access this section."
            showDashboardLink={false}
            showBackButton={false}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Settings Sidebar Navigation */}
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Active Section Content */}
      {renderSection()}
    </div>
  );
}
