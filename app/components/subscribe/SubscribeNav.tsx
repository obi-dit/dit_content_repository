"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getToken } from "@/utils/auth";

export default function SubscribeNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setIsLoggedIn(!!getToken());
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/subscribe" className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <span className="text-lg font-bold text-white">
              DIT Podcast Lounge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#shows"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Shows
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </a>

            {isLoggedIn ? (
              <Link
                href="/subscriber-dashboard"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                My Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/subscribe/login"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Member sign in
                </Link>
                <Link
                  href="/subscribe/checkout"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
          <div className="md:hidden py-4 border-t border-zinc-800 animate-in slide-in-from-top">
            <div className="flex flex-col gap-4">
              <a
                href="#shows"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Shows
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Pricing
              </a>
              {isLoggedIn ? (
                <Link
                  href="/subscriber-dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 transition-all text-center"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/subscribe/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors text-center py-2"
                  >
                    Member sign in
                  </Link>
                  <Link
                    href="/subscribe/checkout"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 transition-all text-center"
                  >
                    Subscribe
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
