"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isLoggedIn, removeToken, removeUser } from "@/utils/auth";
import router from "next/router";

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
}

// Mock data - replace with API calls
const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    type: "Article",
    status: "published",
    views: 1234,
    lastModified: "2 hours ago",
    author: "John Doe",
    description:
      "Learn the fundamentals of Next.js and build modern web applications.",
    likes: 45,
  },
  {
    id: "2",
    title: "API Best Practices",
    type: "Documentation",
    status: "published",
    views: 892,
    lastModified: "5 hours ago",
    author: "Jane Smith",
    description: "Comprehensive guide to building robust and scalable APIs.",
    likes: 32,
  },
  {
    id: "3",
    title: "Design System Guide",
    type: "Guide",
    status: "published",
    views: 567,
    lastModified: "1 day ago",
    author: "John Doe",
    description:
      "Create consistent and beautiful user interfaces with design systems.",
    likes: 28,
  },
  {
    id: "4",
    title: "Content Strategy 2024",
    type: "Article",
    status: "published",
    views: 2341,
    lastModified: "2 days ago",
    author: "Jane Smith",
    description: "Modern approaches to content creation and distribution.",
    likes: 67,
  },
  {
    id: "5",
    title: "AI Content Creation Tips",
    type: "Tutorial",
    status: "published",
    views: 1890,
    lastModified: "4 days ago",
    author: "Jane Smith",
    description: "Master AI tools to enhance your content creation workflow.",
    likes: 89,
  },
  {
    id: "6",
    title: "Video Production Workflow",
    type: "Video",
    status: "published",
    views: 3456,
    lastModified: "1 week ago",
    author: "John Doe",
    description: "Professional video production techniques and workflows.",
    likes: 124,
  },
  {
    id: "7",
    title: "Podcast Episode 1: Introduction",
    type: "Podcast",
    status: "published",
    views: 2100,
    lastModified: "1 week ago",
    author: "Jane Smith",
    description: "Welcome to our podcast series on digital content creation.",
    likes: 56,
  },
  {
    id: "8",
    title: "Capstone Project: AI Assistant",
    type: "Capstone Project",
    status: "published",
    views: 890,
    lastModified: "2 weeks ago",
    author: "John Doe",
    description: "Building an AI-powered assistant from scratch.",
    likes: 78,
  },
];

const typeColors: Record<string, string> = {
  Article: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  Documentation:
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  Guide:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  Tutorial:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  Video: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  Podcast: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
  "AI Media":
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
  "Capstone Project":
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
};

const typeIcons: Record<string, string> = {
  Article: "📄",
  Documentation: "📚",
  Guide: "📖",
  Tutorial: "🎓",
  Video: "🎥",
  Podcast: "🎙️",
  "AI Media": "🤖",
  "Capstone Project": "🏆",
};

export default function ContentShowcasePage() {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [filteredContent, setFilteredContent] =
    useState<ContentItem[]>(initialContent);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "likes">(
    "recent"
  );
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const contentTypes = [
    "all",
    ...Array.from(new Set(content.map((item) => item.type))),
  ];

  const isLoggedInUser = isLoggedIn();

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
          return 0; // Keep original order for recent
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
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
                  {type === "all" ? "All Types" : type}
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
        {filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              No content found. Try adjusting your filters.
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
        <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredContent.length} of{" "}
          {content.filter((item) => item.status === "published").length} content
          items
        </div>
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
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-6xl opacity-50">
          {typeIcons[item.type] || "📄"}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              typeColors[item.type] || "bg-zinc-100 dark:bg-zinc-700"
            }`}
          >
            {item.type}
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
        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="text-4xl opacity-50">
            {typeIcons[item.type] || "📄"}
          </div>
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
                  {item.type}
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
