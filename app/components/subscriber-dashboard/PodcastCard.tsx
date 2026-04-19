"use client";

import Link from "next/link";
import { Podcast } from "@/typings/podcast";

interface PodcastCardProps {
  podcast: Podcast;
  index: number;
  isVisible: boolean;
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(minutes: number | undefined) {
  if (minutes == null) {
    return null;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m} min`;
}

export default function PodcastCard({
  podcast,
  index,
  isVisible,
}: PodcastCardProps) {
  const durationLabel = formatDuration(podcast.durationMinutes);

  return (
    <article
      className={`h-[300px] group rounded-2xl border  border-zinc-700/50 bg-zinc-800/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-amber-600/40 hover:shadow-xl hover:shadow-amber-900/10 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-800/30 bg-gradient-to-br from-amber-500/20 to-orange-600/20">
          <svg
            className="h-6 w-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </div>

        <div className="text-right text-xs text-zinc-500">
          <time dateTime={podcast.createdAt}>
            {formatRelativeDate(podcast.createdAt)}
          </time>
          {durationLabel && (
            <p className="mt-1 font-medium text-zinc-400">{durationLabel}</p>
          )}
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-zinc-50 transition-colors group-hover:text-amber-300">
        {podcast.title}
      </h3>

      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
        {podcast.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        {podcast.watchUrl ? (
          <Link
            href={podcast.watchUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            Watch episode
          </Link>
        ) : (
          <span className="text-sm text-zinc-600">Replay soon</span>
        )}

        <span className="rounded-full bg-zinc-700/50 px-2.5 py-1 text-xs text-zinc-500">
          Recorded
        </span>
      </div>
    </article>
  );
}
