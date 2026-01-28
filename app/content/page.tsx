"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isLoggedIn, removeToken, removeUser } from "@/utils/auth";
import { contentService, PublicContent } from "@/services/contentService";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "archived";
  views: number;
  lastModified: string;
  author: string;
  description?: string;
  likes?: number;
  thumbnail?: string;
  imageUrl?: string;
}

const typeColors: Record<string, string> = {
  article: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  documentation:
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  guide:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  tutorial:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  video: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  podcast: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
  other:
    "bg-zinc-100 dark:bg-zinc-900/30 text-zinc-800 dark:text-zinc-300",
};

const typeIcons: Record<string, string> = {
  article: "📄",
  documentation: "📚",
  guide: "📖",
  tutorial: "🎓",
  video: "🎥",
  podcast: "🎙️",
  other: "📁",
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export default function ContentShowcasePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "likes">(
    "recent"
  );
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    "all",
    ...Array.from(new Set(content.map((item) => item.type))),
  ];

  const isLoggedInUser = isLoggedIn();

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await contentService.getPublishedContent();
        // Map API response to ContentItem format
        const mappedContent: ContentItem[] = data.map((item: PublicContent) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          status: item.status,
          views: item.views,
          lastModified: formatRelativeTime(item.updatedAt || item.createdAt),
          author: item.author,
          description: item.description,
          likes: 0, // API doesn't have likes yet
          imageUrl: item.imageUrl,
        }));
        setContent(mappedContent);
      } catch (err: any) {
        console.error("Failed to fetch content:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    let filtered = content.filter((item) => item.status === "published");

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "likes":
          return (b.likes || 0) - (a.likes || 0);
        case "recent":
        default:
          return 0; // Keep original order for recent (already sorted by createdAt from API)
      }
    });

    setFilteredContent(filtered);
  }, [content, searchQuery, selectedType, sortBy]);

  const handleLike = (id: string) => {
    setLikedItems((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
        // Decrease like count
        setContent((prevContent) =>
          prevContent.map((item) =>
            item.id === id ? { ...item, likes: (item.likes || 0) - 1 } : item
          )
        );
      } else {
        newLiked.add(id);
        // Increase like count
        setContent((prevContent) =>
          prevContent.map((item) =>
            item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
          )
        );
      }
      return newLiked;
    });
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Content Library
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Explore and discover amazing content from our community
              </p>
            </div>
            {!isLoggedInUser ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm sm:text-base cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                🔍
              </span>
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by content type"
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort content"
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="likes">Most Liked</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 rounded-lg p-1 bg-white dark:bg-zinc-900">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title="Grid view"
              >
                ⬜
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-zinc-400">Loading content...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <p className="text-xl text-zinc-400">
              {content.length === 0
                ? "No content available yet."
                : "No content found. Try adjusting your filters."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                isLiked={likedItems.has(item.id)}
                onLike={() => handleLike(item.id)}
                typeColors={typeColors}
                typeIcons={typeIcons}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <ContentListItem
                key={item.id}
                item={item}
                isLiked={likedItems.has(item.id)}
                onLike={() => handleLike(item.id)}
                typeColors={typeColors}
                typeIcons={typeIcons}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && content.length > 0 && (
          <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredContent.length} of{" "}
            {content.filter((item) => item.status === "published").length} content
            items
          </div>
        )}
      </main>
    </div>
  );
}

// Content Card Component (Grid View)
function ContentCard({
  item,
  isLiked,
  onLike,
  typeColors,
  typeIcons,
}: {
  item: ContentItem;
  isLiked: boolean;
  onLike: () => void;
  typeColors: Record<string, string>;
  typeIcons: Record<string, string>;
}) {
  return (
    <div className="group bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Thumbnail/Header */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl opacity-50">
            {typeIcons[item.type] || "📄"}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              typeColors[item.type] || "bg-zinc-100 dark:bg-zinc-700"
            }`}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          <span>by {item.author}</span>
          <span>{item.views.toLocaleString()} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              isLiked
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30"
            }`}
          >
            <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
            <span className="font-medium">{item.likes || 0}</span>
          </button>
          <Link
            href={`/content/${item.id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Content List Item Component (List View)
function ContentListItem({
  item,
  isLiked,
  onLike,
  typeColors,
  typeIcons,
}: {
  item: ContentItem;
  isLiked: boolean;
  onLike: () => void;
  typeColors: Record<string, string>;
  typeIcons: Record<string, string>;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl opacity-50">
              {typeIcons[item.type] || "📄"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    typeColors[item.type] || "bg-zinc-100 dark:bg-zinc-700"
                  }`}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* Meta and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span>by {item.author}</span>
              <span>•</span>
              <span>{item.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{item.lastModified}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isLiked
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                }`}
              >
                <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                <span className="font-medium">{item.likes || 0}</span>
              </button>
              <Link
                href={`/content/${item.id}`}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
