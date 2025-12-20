"use client";

import { useState } from "react";
import SettingsSidebar from "../../components/SettingsSidebar";
import Users from "../../components/settings/Users";
import Preferences from "../../components/settings/Preferences";
import Permission from "../../components/settings/RolesPermission";
import Groups from "../../components/settings/Groups";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("users");

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <Users />;
      case "preferences":
        return <Preferences />;
      case "roles_permissions":
        return <Permission />;
      case "groups":
        return <Groups />;
      default:
        return <Users />;
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
