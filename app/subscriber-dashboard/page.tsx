"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken, logout } from "@/utils/auth";
import { User, UserType } from "@/typings/auth";
import { Podcast, SubscriptionStatus } from "@/typings/podcast";
import type {
  DashboardAnnouncement,
  SubscriberDashboardExtras,
} from "@/typings/subscriber-dashboard";
import { announcementService } from "@/services/announcementService";
import { podcastService } from "@/services/podcastService";
import DashboardSkipLink from "../components/subscriber-dashboard/DashboardSkipLink";
import SubscriberNav from "../components/subscriber-dashboard/SubscriberNav";
import WelcomeSection from "../components/subscriber-dashboard/WelcomeSection";
import LivePodcastSection from "../components/subscriber-dashboard/LivePodcastSection";
import PodcastLibraryPreview from "../components/subscriber-dashboard/PodcastLibraryPreview";
import UpcomingSchedule from "../components/subscriber-dashboard/UpcomingSchedule";
import RecommendationsStrip from "../components/subscriber-dashboard/RecommendationsStrip";
import ProfileSubscriptionOverview from "../components/subscriber-dashboard/ProfileSubscriptionOverview";
import AnnouncementsPanel from "../components/subscriber-dashboard/AnnouncementsPanel";
import QuestionsPanel from "../components/subscriber-dashboard/QuestionsPanel";
import SubscribeFooter from "../components/subscribe/SubscribeFooter";

type PageState = "loading" | "ready" | "error" | "not-subscribed";

export default function SubscriberDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null,
  );
  const [extras, setExtras] = useState<SubscriberDashboardExtras | null>(null);
  const [announcements, setAnnouncements] = useState<DashboardAnnouncement[]>(
    [],
  );
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboardData = useCallback(async () => {
    try {
      setPageState("loading");
      setErrorMessage("");

      const [podcastResult, subscriptionData, extrasData, announcementsRes] =
        await Promise.all([
          podcastService.getPodcasts({ page: 1, limit: 24 }),
          podcastService.getSubscriptionStatus(),
          podcastService.getSubscriberDashboardExtras(),
          announcementService.listSubscriberAnnouncements(50).catch(() => ({
            announcements: [] as DashboardAnnouncement[],
          })),
        ]);

      if (!subscriptionData.isActive) {
        setPageState("not-subscribed");
        return;
      }

      setSubscription(subscriptionData);
      setPodcasts(podcastResult.items);
      setExtras(extrasData);
      setAnnouncements(announcementsRes.announcements);
      setPageState("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load dashboard data",
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
      router.replace("/subscribe/login");
      return;
    }

    setUser(storedUser);
    void loadDashboardData();
  }, [router, loadDashboardData]);

  const handleLogout = () => {
    const subscriber = getUser()?.userType === UserType.SUBSCRIBER;
    logout();
    router.replace(subscriber ? "/subscribe/login" : "/login");
  };

  const livePodcast = useMemo(
    () => podcasts.find((p) => p.isLive) || null,
    [podcasts],
  );

  const pastEpisodes = useMemo(() => {
    return [...podcasts]
      .filter((p) => !p.isLive)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [podcasts]);

  const nextUpcoming = useMemo(() => {
    const list = extras?.upcoming ?? [];
    const now = Date.now();
    const future = list
      .filter((e) => new Date(e.startsAt).getTime() > now)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
    return future[0] ?? list[0] ?? null;
  }, [extras]);

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <div className="absolute inset-3 animate-spin rounded-full border-2 border-orange-500 border-b-transparent [animation-direction:reverse] [animation-duration:0.8s]" />
          </div>
          <p className="text-sm text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (pageState === "not-subscribed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-8">
            <div className="mb-4 text-5xl" aria-hidden>
              🔒
            </div>
            <h2 className="mb-3 text-2xl font-bold text-zinc-50">
              Payment or pass required
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              We don&apos;t see an active lounge pass on this account yet. If
              you registered but didn&apos;t finish Stripe checkout, complete
              payment with the same email. Otherwise you can review plans or
              sign out and try another account.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push("/subscribe/checkout")}
                className="w-full transform rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700 hover:scale-[1.02]"
              >
                Complete checkout &amp; pay
              </button>
              <button
                type="button"
                onClick={() => router.push("/subscribe")}
                className="w-full rounded-lg border border-zinc-700 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                View plans
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-zinc-700 py-3 font-medium text-zinc-400 transition hover:bg-zinc-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-8">
            <div className="mb-4 text-5xl" aria-hidden>
              ⚠️
            </div>
            <h2 className="mb-3 text-2xl font-bold text-zinc-50">
              Something Went Wrong
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              {errorMessage ||
                "We couldn't load your dashboard. Please try again."}
            </p>
            <button
              type="button"
              onClick={loadDashboardData}
              className="w-full transform rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700 hover:scale-[1.02]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const emptyExtras: SubscriberDashboardExtras = {
    upcoming: [],
    questions: [],
    announcements: [],
    recommendations: [],
  };
  const data = extras ?? emptyExtras;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardSkipLink />
      <SubscriberNav user={user} onLogout={handleLogout} />
      <WelcomeSection user={user} subscription={subscription} />

      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none focus:outline-none"
      >
        <LivePodcastSection
          livePodcast={livePodcast}
          nextUpcoming={nextUpcoming}
        />

        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
            <div className="min-w-0 flex-1 space-y-12 lg:space-y-14">
              <PodcastLibraryPreview episodes={pastEpisodes} />
              {/* <UpcomingSchedule episodes={data.upcoming} />
              <RecommendationsStrip items={data.recommendations} /> */}
            </div>

            <aside
              className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-80 xl:w-96"
              aria-label="Account and activity"
            >
              <ProfileSubscriptionOverview
                user={user}
                subscription={subscription}
              />
              <AnnouncementsPanel announcements={announcements} />
              <QuestionsPanel initialQuestions={data.questions} />
            </aside>
          </div>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
