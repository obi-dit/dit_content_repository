"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { contentService, PublicContentDetail } from "@/services/contentService";

interface ContentDetail {
  id: string;
  title: string;
  type: string;
  status: string;
  views: number;
  lastModified: string;
  author: string;
  description: string;
  content: string;
  likes: number;
  imageUrl?: string;
  videoUrl?: string;
}

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

export default function ContentDetailPage() {
  const params = useParams();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!params.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data: PublicContentDetail = await contentService.getPublicContentById(
          params.id as string
        );

        setContent({
          id: data.id,
          title: data.title,
          type: data.type,
          status: data.status,
          views: data.views,
          lastModified: formatRelativeTime(data.updatedAt || data.createdAt),
          author: data.author,
          description: data.description,
          content: data.content,
          likes: 0, // API doesn't have likes yet
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
        });
      } catch (err: any) {
        console.error("Failed to fetch content:", err);
        setError("Content not found or not available.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [params.id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (content) {
      setContent({
        ...content,
        likes: isLiked ? content.likes - 1 : content.likes + 1,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-50 mb-4">
            Content Not Found
          </h1>
          <p className="text-zinc-400 mb-6">
            {error || "The content you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/content"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            ← Back to Content Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/content"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Content Library
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {content.imageUrl ? (
              <>
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </>
            ) : (
              <div className="absolute inset-0 bg-black/20"></div>
            )}
            <div className="relative z-10 text-center px-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {content.title}
              </h1>
              <p className="text-white/90 text-lg">{content.description}</p>
            </div>
          </div>

          {/* Video Section (if video content) */}
          {content.videoUrl && (
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
              <video
                src={content.videoUrl}
                controls
                className="w-full rounded-lg"
                poster={content.imageUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Meta Information */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span>by {content.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👁️</span>
                <span>{content.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕒</span>
                <span>{content.lastModified}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  }`}
                >
                  <span className="text-xl">{isLiked ? "❤️" : "🤍"}</span>
                  <span className="font-medium">{content.likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <div
                className="text-zinc-700 dark:text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
