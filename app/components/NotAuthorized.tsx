"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { GiPadlock } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10 transform transition-all duration-300">
          {/* Icon */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-4 transform hover:scale-110 transition-transform">
              <GiPadlock className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Access Denied
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              You don't have permission to access this page
            </p>
          </div>

          {/* Message */}
          <div className="mb-6 text-center">
            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
              This area is restricted to authorized users only. If you believe
              this is an error, please contact your administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <HiArrowLeft className="text-lg" />
              Go Back
            </button>
            <Link
              href="/content"
              className="block w-full text-center px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Go to Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}








