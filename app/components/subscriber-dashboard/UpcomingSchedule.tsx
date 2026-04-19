"use client";

import type { ScheduledEpisode } from "@/typings/subscriber-dashboard";

interface UpcomingScheduleProps {
  episodes: ScheduledEpisode[];
}

function formatSessionStart(iso: string) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export default function UpcomingSchedule({ episodes }: UpcomingScheduleProps) {
  const sorted = [...episodes].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="pb-12"
    >
      <div>
        <h2
          id="schedule-heading"
          className="mb-2 text-2xl font-bold text-zinc-50 sm:text-3xl"
        >
          Upcoming episodes
        </h2>
        <p className="mb-6 text-zinc-400">
          Mark your calendar — here&apos;s what&apos;s scheduled next.
        </p>

        {sorted.length === 0 ? (
          <p className="rounded-2xl border border-zinc-800 bg-zinc-900/50 py-10 text-center text-sm text-zinc-500">
            New sessions will appear here when they&apos;re announced.
          </p>
        ) : (
          <ol className="space-y-3">
            {sorted.map((ep, i) => {
              const { weekday, month, day, time } = formatSessionStart(
                ep.startsAt
              );
              return (
                <li key={ep.id}>
                  <article className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-800/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 text-center ring-1 ring-amber-800/40"
                        aria-hidden
                      >
                        <span className="text-[10px] font-bold uppercase leading-tight text-amber-500">
                          {weekday}
                        </span>
                        <span className="text-lg font-bold leading-none text-zinc-100">
                          {month} {day}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-zinc-100">
                          {ep.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">{time}</p>
                        {ep.host && (
                          <p className="mt-0.5 text-xs text-zinc-600">
                            Host: {ep.host}
                          </p>
                        )}
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-zinc-700">
                        Session {i + 1}
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
