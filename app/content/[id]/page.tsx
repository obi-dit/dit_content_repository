'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
}

// Mock data - replace with API call
const getContentById = (id: string): ContentDetail | null => {
  const content: Record<string, ContentDetail> = {
    '1': {
      id: '1',
      title: 'Getting Started with Next.js',
      type: 'Article',
      status: 'published',
      views: 1234,
      lastModified: '2 hours ago',
      author: 'John Doe',
      description: 'Learn the fundamentals of Next.js and build modern web applications.',
      content: `# Getting Started with Next.js

Next.js is a powerful React framework that enables you to build full-stack web applications with ease.

## Why Next.js?

- **Server-Side Rendering**: Improve SEO and initial load times
- **File-based Routing**: Simple and intuitive routing system
- **API Routes**: Build backend functionality alongside your frontend
- **Optimized Performance**: Automatic code splitting and image optimization

## Getting Started

To create a new Next.js application, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new Next.js project with all the necessary configurations.

## Key Features

### 1. Pages Directory
Next.js uses a file-based routing system. Create a file in the \`pages\` directory, and it automatically becomes a route.

### 2. API Routes
You can create API endpoints by adding files to the \`pages/api\` directory.

### 3. Image Optimization
Next.js provides an optimized Image component that automatically optimizes images for different screen sizes.

## Conclusion

Next.js is an excellent choice for building modern web applications. Its developer experience and performance optimizations make it a top choice for many developers.`,
      likes: 45,
    },
  };
  return content[id] || null;
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = getContentById(params.id as string);
      setContent(data);
      setIsLoading(false);
    }, 500);
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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Content Not Found
          </h1>
          <Link
            href="/content"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Content Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
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
          <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center px-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                {content.type}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {content.title}
              </h1>
              <p className="text-white/90 text-lg">{content.description}</p>
            </div>
          </div>

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
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                  <span className="font-medium">{content.likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {content.content}
              </div>
            </div>
          </div>
        </article>

        {/* Related Content Suggestions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            More Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/content/${i}`}
                className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  Related Content {i}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Discover more amazing content...
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}



