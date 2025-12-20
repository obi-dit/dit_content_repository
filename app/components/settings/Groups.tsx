"use client";

export default function Groups() {
  return (
    <div className="flex-1 overflow-y-auto">
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Groups
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Manage user groups and team organization
        </p>
      </header>

      <main className="p-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Groups management interface coming soon...
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            This section will allow you to create and manage user groups, assign
            permissions to groups, and organize users into teams.
          </p>
        </div>
      </main>
    </div>
  );
}







