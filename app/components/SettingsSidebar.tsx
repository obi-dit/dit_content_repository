"use client";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const settingsNavigation = [
  { id: "users", name: "Users", icon: "👥" },
  { id: "preferences", name: "Preferences", icon: "⚙️" },
  { id: "roles_permissions", name: "Roles & Permissions", icon: "🔐" },
  { id: "groups", name: "Groups", icon: "👤" },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Settings
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your system settings
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {settingsNavigation.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
