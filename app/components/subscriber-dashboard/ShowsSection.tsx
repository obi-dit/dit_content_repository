"use client";

import { useState } from "react";
import Link from "next/link";
import type { ShowWithPodcasts } from "@/services/showService";

interface ShowsSectionProps {
  shows: ShowWithPodcasts[];
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ShowsSection({ shows }: ShowsSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleShow = (showId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(showId)) {
        next.delete(showId);
      } else {
        next.add(showId);
      }
      return next;
    });
  };

  return (
    <section id="shows" aria-labelledby="shows-heading" className="pb-12">
      <div className="mb-6">
        <h2 id="shows-heading" className="text-2xl font-bold text-zinc-50 sm:text-3xl">
          Shows
        </h2>
        <p className="mt-1 text-zinc-400">
          Browse episodes by show — expand a show to see its content.
        </p>
      </div>

      <div className="space-y-4">
        {shows.map((show) => {
          const isExpanded = expandedIds.has(show.id);
          const episodeCount = show.podcasts.length;

          return (
            <article
              key={show.id}
              className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/80"
            >
              <button
                type="button"
                onClick={() => toggleShow(show.id)}
                aria-expanded={isExpanded ? "true" : "false"}
                aria-controls={`show-panel-${show.id}`}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-zinc-800"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-800/30 bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-2xl">
                  {show.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-50">{show.title}</h3>
                    <span className="rounded-full border border-amber-800/30 bg-amber-900/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      {show.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {show.description}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {episodeCount} episode{episodeCount === 1 ? "" : "s"} available
                  </p>
                </div>

                <span
                  className={`mt-1 shrink-0 text-amber-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div
                  id={`show-panel-${show.id}`}
                  className="border-t border-zinc-700/50 bg-zinc-900/40 px-5 py-4"
                >
                  {episodeCount === 0 ? (
                    <p className="py-4 text-center text-sm text-zinc-500">
                      No episodes for this show yet. Check back soon.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {show.podcasts.map((podcast) => (
                        <li
                          key={podcast.id}
                          className="rounded-xl border border-zinc-700/40 bg-zinc-800/60 p-4 transition hover:border-amber-600/30"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold text-zinc-50">
                                  {podcast.title}
                                </h4>
                                {podcast.isLive && (
                                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-300">
                                    Live
                                  </span>
                                )}
                              </div>
                              {podcast.description && (
                                <p className="line-clamp-2 text-sm text-zinc-400">
                                  {podcast.description}
                                </p>
                              )}
                              <p className="mt-2 text-xs text-zinc-500">
                                {formatRelativeDate(podcast.createdAt)}
                              </p>
                            </div>

                            {podcast.watchUrl && (
                              <Link
                                href={podcast.watchUrl}
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-amber-600 hover:to-orange-700"
                              >
                                Watch episode
                              </Link>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
