"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getToken, logout } from "@/utils/auth";
import { User, UserType } from "@/typings/auth";
import { Podcast, PaginatedPodcasts } from "@/typings/podcast";
import { podcastService } from "@/services/podcastService";
import SubscriberNav from "@/app/components/subscriber-dashboard/SubscriberNav";
import PastEpisodesLibrary from "@/app/components/subscriber-dashboard/PastEpisodesLibrary";
import SubscribeFooter from "@/app/components/subscribe/SubscribeFooter";

type PageState = "loading" | "ready" | "error" | "not-subscribed";

export default function PodcastLibraryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastPagination, setPodcastPagination] = useState<Omit<
    PaginatedPodcasts,
    "items"
  > | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLibrary = useCallback(async () => {
    try {
      setPageState("loading");
      setErrorMessage("");

      const [podcastResult, subscriptionData] = await Promise.all([
        podcastService.getPodcasts({ page: 1, limit: 12 }),
        podcastService.getSubscriptionStatus(),
      ]);

      if (!subscriptionData.isActive) {
        setPageState("not-subscribed");
        return;
      }

      setPodcasts(podcastResult.items);
      setPodcastPagination({
        total: podcastResult.total,
        page: podcastResult.page,
        limit: podcastResult.limit,
        totalPages: podcastResult.totalPages,
      });
      setPageState("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load the library.",
      );
      setPageState("error");
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      router.replace("/subscribe/login");
      return;
    }

    if (storedUser.userType !== UserType.SUBSCRIBER) {
      router.replace("/login");
      return;
    }

    setUser(storedUser);
    void loadLibrary();
  }, [router, loadLibrary]);

  const handleLogout = () => {
    logout();
    router.replace("/subscribe/login");
  };

  const pastEpisodes = podcasts
    .filter((p) => !p.isLive)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
          <p className="text-sm text-zinc-400">Loading library…</p>
        </div>
      </div>
    );
  }

  if (pageState === "not-subscribed") {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <SubscriberNav user={user} onLogout={handleLogout} />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-8">
              <h2 className="mb-3 text-xl font-bold text-zinc-50">
                Subscription required
              </h2>
              <p className="mb-6 text-sm text-zinc-400">
                You need an active pass to browse the podcast library.
              </p>
              <Link
                href="/subscriber-dashboard"
                className="inline-block rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
        <SubscribeFooter />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <SubscriberNav user={user} onLogout={handleLogout} />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-8">
              <h2 className="mb-3 text-xl font-bold text-zinc-50">
                Something went wrong
              </h2>
              <p className="mb-6 text-sm text-zinc-400">{errorMessage}</p>
              <button
                type="button"
                onClick={() => void loadLibrary()}
                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
        <SubscribeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscriberNav user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/subscriber-dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
              Podcast library
            </h1>
            <p className="mt-2 text-zinc-400">
              Every published episode — search, load more, and watch on demand.
            </p>
          </div>
        </div>

        <PastEpisodesLibrary
          episodes={pastEpisodes.slice(0, 3)}
          totalPages={podcastPagination?.totalPages ?? 1}
          currentPage={podcastPagination?.page ?? 1}
          onLoadMore={async (nextPage) => {
            const result = await podcastService.getPodcasts({
              page: nextPage,
              limit: 12,
            });
            setPodcasts((prev) => [...prev, ...result.items]);
            setPodcastPagination({
              total: result.total,
              page: result.page,
              limit: result.limit,
              totalPages: result.totalPages,
            });
          }}
        />
      </main>

      <SubscribeFooter />
    </div>
  );
}
