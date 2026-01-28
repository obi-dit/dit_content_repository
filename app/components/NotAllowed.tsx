"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotAllowedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showDashboardLink?: boolean;
}

export default function NotAllowed({
  title = "Access Denied",
  message = "You don't have permission to access this resource. Please contact your administrator if you believe this is an error.",
  showBackButton = true,
  showDashboardLink = true,
}: NotAllowedProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>

        {/* Message */}
        <p className="text-zinc-400 mb-8 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors font-medium"
            >
              ← Go Back
            </button>
          )}
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-6 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Error Code:{" "}
            <span className="font-mono text-zinc-400">403 Forbidden</span>
          </p>
        </div>
      </div>
    </div>
  );
}
