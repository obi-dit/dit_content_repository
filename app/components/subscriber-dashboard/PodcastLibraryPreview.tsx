"use client";

import Link from "next/link";
import { Podcast } from "@/typings/podcast";
import PodcastCard from "./PodcastCard";

const PREVIEW_COUNT = 6;

interface PodcastLibraryPreviewProps {
  episodes: Podcast[];
}

export default function PodcastLibraryPreview({
  episodes,
}: PodcastLibraryPreviewProps) {
  const preview = episodes.slice(0, PREVIEW_COUNT);
  const hasMore = episodes.length > PREVIEW_COUNT;

  return (
    <section
      id="library"
      aria-labelledby="library-preview-heading"
      className="pb-12"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="library-preview-heading"
            className="text-2xl font-bold text-zinc-50 sm:text-3xl"
          >
            Past episodes
          </h2>
          <p className="mt-1 text-zinc-400">
            Recent recordings — open the full library for search and every
            episode.
          </p>
        </div>
        <Link
          href="/subscriber-dashboard/library"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700"
        >
          Full podcast library
          <span className="ml-1" aria-hidden>
            →
          </span>
        </Link>
      </div>

      {preview.length === 0 ? (
        <div
          className="rounded-2xl border border-zinc-700/50 bg-zinc-800/40 py-16 text-center"
          role="status"
        >
          <p className="text-zinc-400">No recorded episodes yet.</p>
          <Link
            href="/subscriber-dashboard/library"
            className="mt-4 inline-block text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            Check library anyway
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {preview.map((podcast, index) => (
              <div key={podcast.id}>
                <PodcastCard
                  podcast={podcast}
                  index={index}
                  isVisible
                />
              </div>
            ))}
          </div>
          {(hasMore || episodes.length === PREVIEW_COUNT) && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/subscriber-dashboard/library"
                className="text-sm font-medium text-amber-400 transition hover:text-amber-300"
              >
                View all episodes in the library →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
