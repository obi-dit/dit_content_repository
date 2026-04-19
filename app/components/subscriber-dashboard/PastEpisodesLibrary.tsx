"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Podcast } from "@/typings/podcast";
import PodcastCard from "./PodcastCard";

interface PastEpisodesLibraryProps {
  episodes: Podcast[];
  totalPages: number;
  currentPage: number;
  onLoadMore: (nextPage: number) => Promise<void>;
}

export default function PastEpisodesLibrary({
  episodes,
  totalPages,
  currentPage,
  onLoadMore,
}: PastEpisodesLibraryProps) {
  const [query, setQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return episodes;
    }
    return episodes.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [episodes, query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
              10,
            );
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.08 },
    );

    sectionRef.current
      ?.querySelectorAll("[data-index]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filtered]);

  const hasMore = currentPage < totalPages;

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await onLoadMore(currentPage + 1);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section
      id="library"
      ref={sectionRef}
      aria-labelledby="library-heading"
      className="pb-12"
    >
      <div>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="library-heading"
              className="text-2xl font-bold text-zinc-50 sm:text-3xl"
            >
              Past episodes library
            </h2>
            <p className="mt-1 text-zinc-400">
              Browse and watch everything you&apos;ve missed — on demand.
            </p>
          </div>
          <label className="flex w-full flex-col gap-1.5 sm:max-w-xs">
            <span className="sr-only">Search episodes</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or topic…"
              autoComplete="off"
              className="rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div
            className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 py-16 text-center"
            role="status"
          >
            <p className="text-zinc-400">
              {episodes.length === 0
                ? "No recorded episodes yet."
                : "No episodes match your search."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((podcast, index) => (
                <div key={podcast.id} data-index={index}>
                  <PodcastCard
                    podcast={podcast}
                    index={index}
                    isVisible={visibleItems.has(index)}
                  />
                </div>
              ))}
            </div>

            {hasMore && !query.trim() && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-amber-600/50 hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                      Loading…
                    </>
                  ) : (
                    "Load more episodes"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
