"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { AdminPodcastQuestionGroup } from "@/services/questionService";
import type { SubscriberQuestion } from "@/typings/subscriber-dashboard";
import { toVideoEmbedUrl } from "@/utils/video";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status: SubscriberQuestion["status"]) {
  switch (status) {
    case "answered":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "featured":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

const STATUS_OPTIONS: {
  value: SubscriberQuestion["status"];
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "answered", label: "Answered" },
  { value: "featured", label: "Featured" },
];

function LiveStreamPanel({
  title,
  videoUrl,
  imageUrl,
}: {
  title: string;
  videoUrl?: string;
  imageUrl?: string;
}) {
  const embedUrl = useMemo(() => toVideoEmbedUrl(videoUrl), [videoUrl]);

  if (embedUrl) {
    return (
      <div className="border-b border-zinc-200 bg-zinc-950 dark:border-zinc-700">
        <div className="aspect-video w-full">
          <iframe
            title={`Live stream: ${title}`}
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (videoUrl && !embedUrl) {
    return (
      <div className="border-b border-zinc-200 bg-zinc-900 px-5 py-4 dark:border-zinc-700">
        <p className="text-sm text-zinc-400">
          Video URL is set but isn&apos;t a supported embed format. Open the
          subscriber page or edit content to use the stream.
        </p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-amber-600 hover:text-amber-500"
        >
          Open video link
        </a>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="border-b border-zinc-200 dark:border-zinc-700">
        <img
          src={imageUrl}
          alt=""
          className="max-h-56 w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-200 px-5 py-6 text-center dark:border-zinc-700">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No stream URL on this episode yet. Add a video URL on the content item
        to preview it here.
      </p>
    </div>
  );
}

function ReplayPanel({
  title,
  videoUrl,
}: {
  title: string;
  videoUrl?: string;
}) {
  const embedUrl = useMemo(() => toVideoEmbedUrl(videoUrl), [videoUrl]);

  if (!embedUrl && !videoUrl) {
    return null;
  }

  return (
    <details className="group border-b border-zinc-200 bg-zinc-950/40 dark:border-zinc-700">
      <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>▶</span>
          Watch replay / stream recording
        </span>
      </summary>
      {embedUrl ? (
        <div className="aspect-video w-full border-t border-zinc-800">
          <iframe
            title={`Replay: ${title}`}
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="border-t border-zinc-800 px-5 py-3">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            Open video link
          </a>
        </div>
      )}
    </details>
  );
}

export interface PodcastQuestionCardProps {
  group: AdminPodcastQuestionGroup;
  variant: "live" | "past";
  canUpdate: boolean;
  updatingId: string | null;
  onSetStatus: (
    questionId: string,
    status: SubscriberQuestion["status"],
  ) => void;
}

export default function PodcastQuestionCard({
  group,
  variant,
  canUpdate,
  updatingId,
  onSetStatus,
}: PodcastQuestionCardProps) {
  const { podcast } = group;

  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-white dark:bg-zinc-800 ${
        variant === "live"
          ? "border-red-200 ring-2 ring-red-500/20 dark:border-red-900/40 dark:ring-red-500/10"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {podcast.title}
              </h2>
              {podcast.isLive && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  Live
                </span>
              )}
            </div>
            {podcast.description && (
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {podcast.description}
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Published {formatDate(podcast.createdAt)}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link
                href={`/dashboard/content/edit/${podcast.id}`}
                className="font-medium text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
              >
                Edit podcast
              </Link>
              <Link
                href={`/subscriber-dashboard/podcast/${podcast.id}`}
                className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Subscriber view
              </Link>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {group.questions.length} question
            {group.questions.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {variant === "live" ? (
        <LiveStreamPanel
          title={podcast.title}
          videoUrl={podcast.videoUrl}
          imageUrl={podcast.imageUrl}
        />
      ) : (
        <ReplayPanel title={podcast.title} videoUrl={podcast.videoUrl} />
      )}

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {group.questions.map((question) => (
          <li key={question.id} className="px-5 py-4">
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">
              &ldquo;{question.text}&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{formatDate(question.submittedAt)}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${statusClass(
                  question.status,
                )}`}
              >
                {question.status}
              </span>
              {question.askedBy && (
                <span>
                  Asked by {question.askedBy.name} ({question.askedBy.email})
                </span>
              )}
            </div>
            {canUpdate && (
              <div
                className="mt-3 flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Set question status"
              >
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                  Status:
                </span>
                {STATUS_OPTIONS.map(({ value, label }) => {
                  const busy = updatingId === question.id;
                  const isCurrent = question.status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={busy || isCurrent}
                      onClick={() => onSetStatus(question.id, value)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        isCurrent
                          ? "cursor-default border-zinc-300 bg-zinc-200 text-zinc-800 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
