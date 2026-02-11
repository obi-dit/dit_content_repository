"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { contentService } from "@/services/contentService";
import MainLoader from "@/app/components/MainLoader";
import {
  TYPE_SLUG_TO_LABEL,
  VALID_TYPE_SLUGS,
} from "../constants";

type ContentWithMeta = Awaited<
  ReturnType<typeof contentService.getAllContents>
>[number] & { author?: string; views?: number };

export default function CollectionByTypePage() {
  const params = useParams();
  const typeSlug = (params?.type as string) ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentWithMeta[]>([]);

  const isValidType = VALID_TYPE_SLUGS.has(typeSlug);
  const displayLabel = TYPE_SLUG_TO_LABEL[typeSlug] ?? typeSlug;

  const items = useMemo(
    () => content.filter((item) => item.type === typeSlug),
    [content, typeSlug]
  );

  useEffect(() => {
    if (!isValidType) {
      return;
    }
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
  }, [isValidType]);

  if (!isValidType) {
    return (
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Invalid collection
          </h1>
        </header>
        <main className="p-6">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            The collection type &quot;{typeSlug}&quot; is not valid.
          </p>
          <Link
            href="/dashboard/collections"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Collections
          </Link>
        </main>
      </div>
    );
  }

  if (loading) {
    return <MainLoader message="Loading collection..." />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/collections"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                ← Collections
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              {displayLabel}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              All content in this collection
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No content in this collection
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {item.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {(item.views ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.author ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/content/${item.id}`}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="View"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/content/edit/${item.id}`}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="Edit"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
