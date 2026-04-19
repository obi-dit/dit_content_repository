"use client";

import Link from "next/link";
import { Podcast } from "@/typings/podcast";
import type { ScheduledEpisode } from "@/typings/subscriber-dashboard";

interface LivePodcastSectionProps {
  livePodcast: Podcast | null;
  nextUpcoming: ScheduledEpisode | null;
}

export default function LivePodcastSection({
  livePodcast,
  nextUpcoming,
}: LivePodcastSectionProps) {
  if (!livePodcast) {
    return (
      <section
        id="live-podcast"
        aria-labelledby="live-heading"
        className="px-4 pb-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="live-heading"
            className="mb-4 text-xl font-bold text-zinc-50 sm:text-2xl"
          >
            Live now
          </h2>
          <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-8 text-center sm:p-10">
            <p className="text-lg text-zinc-300">
              There isn&apos;t a live session right now.
            </p>
            {nextUpcoming && (
              <p className="mt-3 text-sm text-zinc-500">
                Next up:{" "}
                <span className="font-medium text-amber-400/90">
                  {nextUpcoming.title}
                </span>{" "}
                ·{" "}
                {new Date(nextUpcoming.startsAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
            <Link
              href="#schedule"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              View full schedule
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="live-podcast"
      aria-labelledby="live-heading"
      className="px-4 pb-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2
            id="live-heading"
            className="text-xl font-bold text-zinc-50 sm:text-2xl"
          >
            Live podcast
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold tracking-wide text-white">
            <span
              className="h-2 w-2 rounded-full bg-white"
              aria-hidden
            />
            LIVE
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-amber-600/35 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 shadow-xl shadow-amber-950/20">
          <div className="aspect-video w-full bg-black/80 sm:aspect-[21/9]">
            {livePodcast.streamEmbedUrl ? (
              <iframe
                title={`Live stream: ${livePodcast.title}`}
                src={livePodcast.streamEmbedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 px-4 text-center"
                role="img"
                aria-label="Stream placeholder until broadcast starts"
              >
                <div className="rounded-full border-2 border-amber-500/40 p-4">
                  <svg
                    className="h-10 w-10 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400">
                  Video feed loads here when the host goes live.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-zinc-800/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-50 sm:text-xl">
                {livePodcast.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                {livePodcast.description}
              </p>
            </div>
            {livePodcast.zoomLink ? (
              <a
                href={livePodcast.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                Join live room
                <span aria-hidden>→</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
