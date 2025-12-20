"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContentTable, { ContentItem } from "../../components/ContentTable";
import { contentService } from "@/services/contentService";

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
  {
    id: "6",
    title: "AI Content Creation Tips",
    type: "Tutorial",
    status: "published",
    views: 1890,
    lastModified: "4 days ago",
    author: "Jane Smith",
  },
  {
    id: "7",
    title: "Video Production Workflow",
    type: "Video",
    status: "draft",
    views: 0,
    lastModified: "5 days ago",
    author: "John Doe",
  },
  {
    id: "8",
    title: "Podcast Episode 1",
    type: "Podcast",
    status: "published",
    views: 3456,
    lastModified: "1 week ago",
    author: "Jane Smith",
  },
];

export default function ContentPage() {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  const handleEdit = (item: ContentItem) => {
    // Navigate to edit page
    router.push(`/dashboard/content/edit/${item.id}`);
  };

  const handleView = (item: ContentItem) => {
    // Navigate to view page
    router.push(`/dashboard/content/${item.id}`);
  };

  const handleMore = (item: ContentItem) => {
    // Open more options menu
    console.log("More options for item:", item);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setContent(content.filter((item) => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size > 0) {
      setContent(content.filter((item) => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(content.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const getAllContents = async () => {
    const response = await contentService.getAllContents();
    setContent(response);
  };

  useEffect(() => {
    getAllContents();
  }, []);

  const stats = {
    total: content.length,
    published: content.filter((item) => item.status === "published").length,
    draft: content.filter((item) => item.status === "draft").length,
    archived: content.filter((item) => item.status === "archived").length,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Content Management
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Create, manage, and organize your digital content
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm"
              >
                Delete Selected ({selectedItems.size})
              </button>
            )}
            <Link
              href="/dashboard/content/new"
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              + New Content
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.total}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Total Content
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.published}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Published
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.draft}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Draft
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400">
              {stats.archived}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Archived
            </div>
          </div>
        </div>

        {/* Content Table */}
        <ContentTable
          items={content}
          title="All Content"
          showSearch={true}
          showFilter={true}
          onEdit={handleEdit}
          onView={handleView}
          onMore={handleMore}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Delete Content
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to delete &quot;{itemToDelete.title}&quot;?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
