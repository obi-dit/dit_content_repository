"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { contentService } from "@/services/contentService";

interface ContentDetails {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  status: "published" | "draft" | "archived";
  views: number;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function ViewContentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [content, setContent] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentService.getContentById(id);
      setContent(data as ContentDetails);
    } catch (err: any) {
      setError(err.message || "Failed to load content");
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      draft:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      archived: "bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl mb-4">⏳</div>
            <p className="text-zinc-600 dark:text-zinc-400">
              Loading content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl mb-4">❌</div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl mb-4">📄</div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Content not found
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
              title="Go back"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {content.title}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                View content details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/content/edit/${content._id}`}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm sm:text-base"
            >
              ✏️ Edit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Content Header Info */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {getStatusBadge(content.status)}
              {getTypeBadge(content.type)}
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                👁️ {content.views.toLocaleString()} views
              </div>
            </div>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(content.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Modified:</span>{" "}
                {new Date(content.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Description */}
          {content.description && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                Description
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {content.description}
              </p>
            </div>
          )}

          {/* Image */}
          {content.imageUrl && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                Image
              </h2>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          {/* Video */}
          {content.videoUrl && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                Video
              </h2>
              <div className="rounded-lg overflow-hidden">
                <video
                  src={content.videoUrl}
                  controls
                  className="w-full h-auto max-h-96"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Content
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {content.content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
