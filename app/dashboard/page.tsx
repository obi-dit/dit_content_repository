"use client";

import Link from "next/link";
import ContentTable, { ContentItem } from "../components/ContentTable";
import RecentActivity from "../components/RecentActivity";

const stats = [
  {
    name: "Total Content",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: "📄",
  },
  {
    name: "Published",
    value: "892",
    change: "+8%",
    changeType: "positive",
    icon: "✅",
  },
  {
    name: "Total Views",
    value: "45.2K",
    change: "+23%",
    changeType: "positive",
    icon: "👁️",
  },
  {
    name: "Draft Items",
    value: "342",
    change: "-5%",
    changeType: "negative",
    icon: "📝",
  },
];

const recentContent: ContentItem[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    type: "Article",
    status: "published",
    views: 1234,
    lastModified: "2 hours ago",
    author: "John Doe",
  },
  {
    id: "2",
    title: "API Best Practices",
    type: "Documentation",
    status: "published",
    views: 892,
    lastModified: "5 hours ago",
    author: "Jane Smith",
  },
  {
    id: "3",
    title: "Design System Guide",
    type: "Guide",
    status: "draft",
    views: 0,
    lastModified: "1 day ago",
    author: "John Doe",
  },
  {
    id: "4",
    title: "Content Strategy 2024",
    type: "Article",
    status: "published",
    views: 2341,
    lastModified: "2 days ago",
    author: "Jane Smith",
  },
  {
    id: "5",
    title: "Technical Documentation",
    type: "Documentation",
    status: "archived",
    views: 567,
    lastModified: "3 days ago",
    author: "John Doe",
  },
];

export default function DashboardPage() {
  const handleEdit = (item: ContentItem) => {
    console.log("Edit item:", item);
    // TODO: Implement edit functionality
  };

  const handleView = (item: ContentItem) => {
    console.log("View item:", item);
    // TODO: Implement view functionality
  };

  const handleMore = (item: ContentItem) => {
    console.log("More options for item:", item);
    // TODO: Implement more options menu
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Welcome back! Here's what's happening with your content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
              🔔
            </button>
            <Link
              href="/dashboard/content/new"
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              + New Content
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {stat.name}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Content Section */}
        {/* <ContentTable
          items={recentContent}
          title="Recent Content"
          showSearch={true}
          showFilter={true}
          onEdit={handleEdit}
          onView={handleView}
          onMore={handleMore}
        /> */}

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-left">
                <div className="text-2xl mb-2">📄</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                  New Article
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Create content
                </div>
              </button>
              <button className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-left">
                <div className="text-2xl mb-2">📁</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                  New Collection
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Organize content
                </div>
              </button>
              <button className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-left">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                  View Analytics
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  See insights
                </div>
              </button>
              <button className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-left">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Settings
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Configure
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
