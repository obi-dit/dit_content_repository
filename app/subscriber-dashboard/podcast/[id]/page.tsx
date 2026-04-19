"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PodcastDetail } from "@/typings/podcast";
import { podcastService } from "@/services/podcastService";
import { getToken, getUser, logout } from "@/utils/auth";
import { UserType } from "@/typings/auth";
import SubscriberNav from "@/app/components/subscriber-dashboard/SubscriberNav";
import SubscribeFooter from "@/app/components/subscribe/SubscribeFooter";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    const token = getToken();
    const stored = getUser();
    if (!token || !stored) {
      router.replace("/subscribe/login");
      return;
    }
    if (stored.userType !== UserType.SUBSCRIBER) {
      router.replace("/login");
    }
  }, [router]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await podcastService.getPodcastById(id);
      setPodcast(data);
    } catch {
      setError("Could not load this episode. It may not exist or isn\u2019t published yet.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleLogout = () => {
    logout();
    router.replace("/subscribe/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
          <p className="text-sm text-zinc-400">Loading episode…</p>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <SubscriberNav user={user} onLogout={handleLogout} />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-8">
              <div className="mb-4 text-5xl" aria-hidden>
                📭
              </div>
              <h2 className="mb-3 text-2xl font-bold text-zinc-50">
                Episode not found
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                {error || "This episode doesn\u2019t exist or is no longer available."}
              </p>
              <Link
                href="/subscriber-dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-600"
              >
                ← Back to dashboard
              </Link>
            </div>
          </div>
        </div>
        <SubscribeFooter />
      </div>
    );
  }

  const hasVideo = !!podcast.streamEmbedUrl || !!podcast.videoUrl;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscriberNav user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/subscriber-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        {/* Live badge */}
        {podcast.isLive && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold tracking-wide text-white">
              <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
              LIVE NOW
            </span>
          </div>
        )}

        {/* Title & date */}
        <h1 className="mb-2 text-3xl font-bold text-zinc-50 sm:text-4xl">
          {podcast.title}
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          {formatDate(podcast.createdAt)}
        </p>

        {/* Hero image */}
        {podcast.imageUrl && !hasVideo && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-700/50">
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Video / stream embed */}
        {hasVideo && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-700/50 bg-black">
            {podcast.streamEmbedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  title={podcast.title}
                  src={podcast.streamEmbedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : podcast.videoUrl ? (
              <video
                src={podcast.videoUrl}
                controls
                poster={podcast.imageUrl}
                className="w-full"
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        {/* Description */}
        {podcast.description && (
          <p className="mb-8 text-lg leading-relaxed text-zinc-300">
            {podcast.description}
          </p>
        )}

        {/* Show notes / content body */}
        {podcast.content && (
          <section className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-50">
              Show notes
            </h2>
            <div
              className="prose prose-invert prose-amber max-w-none text-zinc-300 prose-headings:text-zinc-100 prose-a:text-amber-400 prose-strong:text-zinc-100"
              dangerouslySetInnerHTML={{ __html: podcast.content }}
            />
          </section>
        )}

        {/* Bottom nav */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/subscriber-dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
