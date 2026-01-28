"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ContentTable, { ContentItem } from "../components/ContentTable";
import RecentActivity from "../components/RecentActivity";
import { dashboardService, DashboardData } from "@/services/dashboardService";
import MainLoader from "../components/MainLoader";
import AccessDenied from "../components/AccessDenied";
import { isForbiddenError } from "@/utils/errors";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsForbidden(false);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      if (isForbiddenError(err)) {
        setIsForbidden(true);
        setError(err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      }
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const stats = dashboardData
    ? [
        {
          name: "Total Content",
          value: formatNumber(dashboardData.stats.totalContent),
          change: "+12%",
          changeType: "positive" as const,
          icon: "📄",
        },
        {
          name: "Published",
          value: formatNumber(dashboardData.stats.published),
          change: dashboardData.stats.publishedChange || "+8%",
          changeType: "positive" as const,
          icon: "✅",
        },
        {
          name: "Total Views",
          value: formatNumber(dashboardData.stats.totalViews),
          change: dashboardData.stats.viewsChange || "+23%",
          changeType: "positive" as const,
          icon: "👁️",
        },
        {
          name: "Draft Items",
          value: formatNumber(dashboardData.stats.draft),
          change: "-5%",
          changeType: "negative" as const,
          icon: "📝",
        },
      ]
    : [];

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

  if (isLoading) {
    return <MainLoader message="Loading dashboard..." />;
  }

  if (isForbidden) {
    return (
      <AccessDenied
        title="Dashboard Access Denied"
        message={error || "You don't have permission to view the dashboard. Please contact your administrator to request access."}
        resource="/dashboard"
        showLogoutButton={true}
        onRetry={loadDashboardData}
      />
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <RecentActivity
            activities={dashboardData?.recentActivity || []}
            title="Recent Activity"
            maxItems={5}
          />
        </div>
      </main>
    </div>
  );
}
