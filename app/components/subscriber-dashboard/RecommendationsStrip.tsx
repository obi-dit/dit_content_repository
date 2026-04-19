"use client";

import Link from "next/link";
import type { EpisodeRecommendation } from "@/typings/subscriber-dashboard";

interface RecommendationsStripProps {
  items: EpisodeRecommendation[];
}

export default function RecommendationsStrip({
  items,
}: RecommendationsStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="recommendations"
      aria-labelledby="rec-heading"
      className="pb-12"
    >
      <div>
        <h2
          id="rec-heading"
          className="mb-2 text-2xl font-bold text-zinc-50 sm:text-3xl"
        >
          Recommended for you
        </h2>
        <p className="mb-6 text-zinc-400">
          Picked from what members with similar viewing habits enjoyed next.
        </p>

        <div
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
          role="list"
          aria-label="Recommended episodes"
        >
          {items.map((item) => (
            <article
              key={item.id}
              role="listitem"
              className="w-[min(100%,280px)] shrink-0 snap-start rounded-2xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-amber-800/50"
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-700/20 text-sm font-bold text-amber-200 ring-1 ring-amber-800/40"
                  aria-hidden
                >
                  {item.thumbnailLabel || "▶"}
                </div>
                <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-zinc-100">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500">
                {item.reason}
              </p>
              <Link
                href={`#library`}
                className="mt-3 inline-flex text-xs font-semibold text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              >
                Find in library →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
