"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  resource?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showLogoutButton?: boolean;
  compact?: boolean;
  onRetry?: () => void;
}

export default function AccessDenied({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  resource,
  showBackButton = true,
  showHomeButton = true,
  showLogoutButton = false,
  compact = false,
  onRetry,
}: AccessDeniedProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("app_token");
    localStorage.removeItem("app_user");
    localStorage.removeItem("app_permissions");
    router.push("/login");
  };

  if (compact) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-sm w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="max-w-lg w-full">
        {/* Card Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v.01M12 12v-4m0 0a1 1 0 100-2 1 1 0 000 2zm-7 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-3">{title}</h1>
            <p className="text-zinc-400 leading-relaxed">{message}</p>
            {resource && (
              <p className="mt-3 text-sm text-zinc-500">
                Requested resource:{" "}
                <span className="font-mono text-zinc-400">{resource}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            )}

            

            {showLogoutButton && (
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 rounded-lg text-red-400 font-medium hover:bg-red-500/10 transition-colors"
              >
                Sign Out & Try Different Account
              </button>
            )}
          </div>

          {/* Error Code */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-600">
              Error Code:{" "}
              <span className="font-mono text-zinc-500">403 Forbidden</span>
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Contact your administrator if you need access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
