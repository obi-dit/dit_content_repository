"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@/typings/auth";

const DESKTOP_LINKS = [
  { href: "/subscriber-dashboard#live-podcast", label: "Live" },
  { href: "/subscriber-dashboard/library", label: "Library" },
  { href: "/subscriber-dashboard#schedule", label: "Schedule" },
  { href: "/subscriber-dashboard#recommendations", label: "For you" },
  { href: "/subscriber-dashboard#questions", label: "Questions" },
] as const;

interface SubscriberNavProps {
  user: User | null;
  onLogout: () => void;
}

export default function SubscriberNav({ user, onLogout }: SubscriberNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/90 shadow-lg shadow-black/20 backdrop-blur-md"
      aria-label="Subscriber dashboard"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/subscriber-dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-2xl" aria-hidden>
              🎙️
            </span>
            <span className="text-lg font-bold text-white">
              DIT Podcast Lounge
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {DESKTOP_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/subscribe"
              className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Browse shows
            </Link>
          </div>

          <div className="hidden items-center gap-3 border-l border-zinc-700 pl-4 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <span className="max-w-[120px] truncate text-sm text-zinc-300">
              {user?.firstName || "User"}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="text-sm text-zinc-500 transition hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="subscriber-mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            id="subscriber-mobile-menu"
            className="animate-in border-t border-zinc-800 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {DESKTOP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Browse shows
                </Link>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-3 border-t border-zinc-800 pt-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <span className="text-sm text-zinc-300">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
