"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SubscribeHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-red-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-6 animate-fade-in">
            <span className="px-4 py-2 rounded-full bg-amber-900/30 text-amber-300 text-sm font-semibold shadow-lg border border-amber-800/40">
              🎙️ EXCLUSIVE 18+ CONTENT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-50 mb-6 leading-tight">
            Real Talk.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
              Real Connections.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            The premier podcast and video repository for men over 40.
            Unfiltered conversations, exclusive meet-ups, and content you
            won&apos;t find anywhere else.
          </p>

          <p className="text-base text-zinc-500 mb-10 max-w-2xl mx-auto">
            Watch. Listen. Connect. Join a community of like-minded men who
            know exactly what they want.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/subscribe/checkout"
              className="group px-8 py-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Subscribe Now — $50/mo
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <a
              href="#shows"
              className="px-8 py-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/50 text-zinc-200 font-semibold text-lg hover:bg-zinc-800 transition-all transform hover:scale-105"
            >
              Browse Shows
            </a>
          </div>

          <div className="mt-16 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <span className="text-sm">See what&apos;s inside</span>
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
