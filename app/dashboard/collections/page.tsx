"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { contentService } from "@/services/contentService";
import MainLoader from "@/app/components/MainLoader";
import { COLLECTION_CONTENT_TYPES } from "./constants";

type ContentWithMeta = Awaited<
  ReturnType<typeof contentService.getAllContents>
>[number] & { author?: string; views?: number };

export default function CollectionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentWithMeta[]>([]);

  const countByType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { slug } of COLLECTION_CONTENT_TYPES) {
      counts[slug] = 0;
    }
    for (const item of content) {
      const t = item.type as string;
      if (t in counts) {
        counts[t] += 1;
      } else {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return counts;
  }, [content]);

  useEffect(() => {
    let cancelled = false;
    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);
        const data = await contentService.getAllContents();
        if (!cancelled) {
          setContent(data as ContentWithMeta[]);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load content"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchContent();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <MainLoader message="Loading collections..." />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Collections
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Browse content by type
        </p>
      </header>

      <main className="p-4 sm:p-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLLECTION_CONTENT_TYPES.map(({ slug, label }) => (
            <Link
              key={slug}
              href={`/dashboard/collections/${slug}`}
              className="group flex flex-col bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <div className="flex items-start justify-between flex-row">
              
              <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {countByType[slug] ?? 0}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {label}
              </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-700/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7"
                  aria-hidden
                >
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                </svg>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
