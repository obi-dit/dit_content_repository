"use client";

import { Podcast } from "@/typings/podcast";

interface LivePodcastBannerProps {
  podcast: Podcast;
}

export default function LivePodcastBanner({ podcast }: LivePodcastBannerProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/60 via-zinc-900 to-zinc-900 border border-amber-600/40 shadow-xl shadow-amber-900/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-wider shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    LIVE NOW
                  </span>

                  <span className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 text-xs font-semibold border border-amber-800/30">
                    🎙️ Streaming
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-3">
                  {podcast.title}
                </h2>

                <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
                  {podcast.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                {podcast.zoomLink ? (
                  <a
                    href={podcast.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                    Join Now
                    <span className="inline-block group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-700/50 text-zinc-400 font-medium">
                    <svg
                      className="w-5 h-5 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Starting soon...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
