"use client";

import { Content } from "@/services/contentService";
import { useState, useEffect } from "react";

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "archived";
  views: number;
  lastModified: string;
  createdAt: string;
  author: string;
}

interface ContentTableProps {
  items: Array<ContentItem | Content>;
  title?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  onEdit?: (item: ContentItem) => void;
  onView?: (item: ContentItem) => void;
  onMore?: (item: ContentItem) => void;
}

export default function ContentTable({
  items,
  title = "Content",
  showSearch = true,
  showFilter = true,
  onEdit,
  onView,
  onMore,
}: ContentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filteredItems, setFilteredItems] =
    useState<(ContentItem | Content)[]>(items);

  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredItems(filtered);
  }, [searchQuery, filterStatus, items]);

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
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isContentItem = (item: ContentItem | Content): item is ContentItem => {
    return "author" in item && "views" in item && "lastModified" in item;
  };

  const handleEdit = (item: ContentItem | Content) => {
    if (onEdit && isContentItem(item)) {
      onEdit(item);
    }
  };

  const handleView = (item: ContentItem | Content) => {
    if (onView && isContentItem(item)) {
      onView(item);
    }
  };

  const handleMore = (item: ContentItem | Content) => {
    if (onMore && isContentItem(item)) {
      onMore(item);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {(showSearch || showFilter) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              {showSearch && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    🔍
                  </span>
                </div>
              )}
              {/* Filter */}
              {showFilter && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                >
                  No content found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        by {"author" in item ? item.author : "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.type}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {"views" in item ? item.views.toLocaleString() : "0"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {"createdAt" in item
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleMore(item)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
                        title="More options"
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
