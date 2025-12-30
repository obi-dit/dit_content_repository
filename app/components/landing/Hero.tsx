"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldShowAuth = process.env.NEXT_PUBLIC_SHOW_AUTH === "true";
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-6 animate-fade-in">
            <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold shadow-lg">
              🚀 DIT TECH DIGITAL STUDIOS
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
            AI-Driven Digital
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Content Library
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            A fully self-contained, web-based platform designed to serve as a
            production and training hub for DIT's AI Essentials and Technology
            Programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group px-8 py-4 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
            {shouldShowAuth && (
              <Link
                href="/login"
                className="px-8 py-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <span className="text-sm">Scroll to explore</span>
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
