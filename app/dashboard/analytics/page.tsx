"use client";

import { useState, useEffect } from "react";
import { analyticsService, AnalyticsData } from "@/services/analyticsService";
import MainLoader from "../../components/MainLoader";
import AccessDenied from "../../components/AccessDenied";
import { isForbiddenError } from "@/utils/errors";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalyticsData();
  }, [days]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsForbidden(false);
      const data = await analyticsService.getAnalyticsData(days);
      setAnalyticsData(data);
    } catch (err) {
      if (isForbiddenError(err)) {
        setIsForbidden(true);
        setError(err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics data"
        );
      }
      console.error("Error loading analytics data:", err);
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

  const getMaxValue = (data: { count: number }[] | { views: number }[]) => {
    return Math.max(...data.map((item: any) => item.count || item.views || 0), 1);
  };

  if (isLoading) {
    return <MainLoader message="Loading analytics..." />;
  }

  if (isForbidden) {
    return (
      <AccessDenied
        title="Analytics Access Denied"
        message={error || "You don't have permission to view analytics. Please contact your administrator to request access."}
        resource="/dashboard/analytics"
        showLogoutButton={true}
        onRetry={loadAnalyticsData}
      />
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const statusMax = getMaxValue(analyticsData.contentByStatus);
  const typeMax = getMaxValue(analyticsData.contentByType);
  const viewsMax = getMaxValue(analyticsData.viewsOverTime);

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Analytics
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              View insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Total Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Total Content
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(analyticsData.totalStats.totalContent)}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Total Views
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(analyticsData.totalStats.totalViews)}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Average Views
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(analyticsData.totalStats.averageViews)}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Published
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(analyticsData.totalStats.publishedCount)}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Drafts
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(analyticsData.totalStats.draftCount)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content by Status */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Content by Status
            </h2>
            <div className="space-y-4">
              {analyticsData.contentByStatus.map((item) => {
                const percentage = (item.count / statusMax) * 100;
                const statusColors: Record<string, string> = {
                  Published: "bg-green-500",
                  Draft: "bg-yellow-500",
                  Archived: "bg-gray-500",
                };
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {item.status}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          statusColors[item.status] || "bg-blue-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content by Type */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Content by Type
            </h2>
            <div className="space-y-4">
              {analyticsData.contentByType.map((item) => {
                const percentage = (item.count / typeMax) * 100;
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {item.type}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Views Over Time
          </h2>
          <div className="flex items-end gap-2 h-64">
            {analyticsData.viewsOverTime.map((item, index) => {
              const percentage = (item.views / viewsMax) * 100;
              const date = new Date(item.date);
              const isLabeled = index % Math.ceil(analyticsData.viewsOverTime.length / 7) === 0;
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${percentage}%` }}
                      title={`${date.toLocaleDateString()}: ${item.views} views`}
                    ></div>
                  </div>
                  {isLabeled && (
                    <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Content */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Top Content by Views
            </h2>
            <div className="space-y-3">
              {analyticsData.topContent.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                  No content available
                </p>
              ) : (
                analyticsData.topContent.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.author} • {item.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {formatNumber(item.views)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content by Author */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Content by Author
            </h2>
            <div className="space-y-3">
              {analyticsData.contentByAuthor.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                  No authors available
                </p>
              ) : (
                analyticsData.contentByAuthor
                  .sort((a, b) => b.count - a.count)
                  .map((item) => (
                    <div
                      key={item.authorId}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {item.author}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.count} content{item.count !== 1 ? "s" : ""} •{" "}
                          {formatNumber(item.totalViews)} views
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
