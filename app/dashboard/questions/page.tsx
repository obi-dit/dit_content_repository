"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MainLoader from "@/app/components/MainLoader";
import NotAllowed from "@/app/components/NotAllowed";
import { usePermissions } from "@/contexts/PermissionContext";
import { PermissionAction, PermissionResource } from "@/typings/permissions";
import {
  questionService,
  type AdminPodcastQuestionGroup,
} from "@/services/questionService";
import type { SubscriberQuestion } from "@/typings/subscriber-dashboard";
import PodcastQuestionCard from "./PodcastQuestionCard";

function sortGroupsByDateDesc(groups: AdminPodcastQuestionGroup[]) {
  return [...groups].sort(
    (a, b) =>
      new Date(b.podcast.createdAt).getTime() -
      new Date(a.podcast.createdAt).getTime(),
  );
}

export default function AdminQuestionsPage() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canRead = hasPermission(
    PermissionResource.CONTENT,
    PermissionAction.READ,
  );
  const canUpdate = hasPermission(
    PermissionResource.CONTENT,
    PermissionAction.UPDATE,
  );
  const [groups, setGroups] = useState<AdminPodcastQuestionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    if (!canRead) return;
    setLoading(true);
    setError("");
    try {
      const data = await questionService.listQuestionsByPodcast();
      setGroups(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load podcast questions",
      );
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const { liveSessions, previousSessions } = useMemo(() => {
    const live = groups.filter((g) => g.podcast.isLive);
    const past = groups.filter((g) => !g.podcast.isLive);
    return {
      liveSessions: sortGroupsByDateDesc(live),
      previousSessions: sortGroupsByDateDesc(past),
    };
  }, [groups]);

  const totalQuestions = useMemo(
    () => groups.reduce((sum, group) => sum + group.questions.length, 0),
    [groups],
  );

  const liveQuestionCount = useMemo(
    () => liveSessions.reduce((sum, g) => sum + g.questions.length, 0),
    [liveSessions],
  );

  const pastQuestionCount = useMemo(
    () => previousSessions.reduce((sum, g) => sum + g.questions.length, 0),
    [previousSessions],
  );

  const applyStatusLocally = useCallback(
    (questionId: string, status: SubscriberQuestion["status"]) => {
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          questions: group.questions.map((q) =>
            q.id === questionId ? { ...q, status } : q,
          ),
        })),
      );
    },
    [],
  );

  const handleSetStatus = useCallback(
    async (questionId: string, status: SubscriberQuestion["status"]) => {
      if (!canUpdate) return;
      if (updatingId === questionId) return;
      setUpdatingId(questionId);
      setError("");
      try {
        await questionService.updateQuestionStatus(questionId, status);
        applyStatusLocally(questionId, status);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not update question status",
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [applyStatusLocally, canUpdate, updatingId],
  );

  const headerHint = canUpdate
    ? "Manage statuses per question. Live episodes show the stream when a video URL is set."
    : "View-only; status changes need content update permission.";

  if (permissionsLoading) {
    return <MainLoader message="Checking permissions..." />;
  }

  if (!canRead) {
    return (
      <NotAllowed
        title="Access denied"
        message="You need content read permission to view podcast questions."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-800 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Podcast questions
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Current live episodes and past sessions that received subscriber
              questions. {headerHint}
            </p>
          </div>
          <button
            type="button"
            onClick={loadQuestions}
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Podcasts with questions
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {groups.length}
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 dark:border-red-900/40 dark:bg-red-950/30">
            <p className="text-sm text-red-800 dark:text-red-300/90">
              Live now (questions)
            </p>
            <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-200">
              {liveQuestionCount}
            </p>
            <p className="mt-1 text-xs text-red-700/80 dark:text-red-400/80">
              {liveSessions.length} episode
              {liveSessions.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Previous sessions (questions)
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {pastQuestionCount}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {previousSessions.length} episode
              {previousSessions.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              All questions
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {totalQuestions}
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {loading && groups.length === 0 ? (
          <MainLoader message="Loading questions..." />
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              No questions yet
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Subscriber questions will appear here once they are submitted
              during a live podcast.
            </p>
          </div>
        ) : (
          <>
            <section aria-labelledby="live-heading" className="space-y-4">
              <div className="flex flex-col gap-1 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                <h2
                  id="live-heading"
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
                >
                  Live now
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Episodes currently marked live on content. Stream preview uses
                  the episode video URL when it is a supported embed (e.g.
                  YouTube).
                </p>
              </div>
              {liveSessions.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400">
                  No live episodes with questions right now. When a podcast is
                  set to live and subscribers ask questions, they will appear
                  here.
                </p>
              ) : (
                <div className="space-y-6">
                  {liveSessions.map((group) => (
                    <PodcastQuestionCard
                      key={group.podcast.id}
                      group={group}
                      variant="live"
                      canUpdate={canUpdate}
                      updatingId={updatingId}
                      onSetStatus={handleSetStatus}
                    />
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="past-heading" className="space-y-4">
              <div className="flex flex-col gap-1 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                <h2
                  id="past-heading"
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
                >
                  Previous live sessions
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Past episodes that still have subscriber questions (stream is
                  no longer live). Expand &ldquo;Watch replay&rdquo; if a video
                  URL is saved on the episode.
                </p>
              </div>
              {previousSessions.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400">
                  No past episodes with stored questions yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {previousSessions.map((group) => (
                    <PodcastQuestionCard
                      key={group.podcast.id}
                      group={group}
                      variant="past"
                      canUpdate={canUpdate}
                      updatingId={updatingId}
                      onSetStatus={handleSetStatus}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
