"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const shouldShowAuth = process.env.NEXT_PUBLIC_SHOW_AUTH === "true";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo_trans.png"
              alt="DIT Tech Digital Studios"
              width={400}
              height={400}
              className="w-40 h-40"
            />
          </Link>

          {/* Desktop Menu */}

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Benefits
            </Link>
            {shouldShowAuth && (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Sign In
              </Link>
            )}
            {shouldShowAuth && (
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-700 animate-in slide-in-from-top">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#benefits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Benefits
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
