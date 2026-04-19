"use client";

import type { DashboardAnnouncement } from "@/typings/subscriber-dashboard";

interface AnnouncementsPanelProps {
  announcements: DashboardAnnouncement[];
}

function kindStyles(kind: DashboardAnnouncement["kind"]) {
  switch (kind) {
    case "live":
      return "border-red-900/50 bg-red-950/20 text-red-300";
    case "reminder":
      return "border-amber-900/50 bg-amber-950/20 text-amber-200";
    default:
      return "border-zinc-700 bg-zinc-800/40 text-zinc-300";
  }
}

function kindLabel(kind: DashboardAnnouncement["kind"]) {
  switch (kind) {
    case "live":
      return "Live";
    case "reminder":
      return "Reminder";
    default:
      return "Update";
  }
}

export default function AnnouncementsPanel({
  announcements,
}: AnnouncementsPanelProps) {
  const sorted = [...announcements].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <section
        aria-labelledby="announcements-heading"
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
      >
        <h2
          id="announcements-heading"
          className="text-lg font-bold text-zinc-50"
        >
          Announcements
        </h2>
        <p className="mt-2 text-sm text-zinc-500">No updates at the moment.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="announcements-heading"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      <h2 id="announcements-heading" className="text-lg font-bold text-zinc-50">
        Announcements
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Live events and product updates in one place.
      </p>

      <ul className="mt-4 space-y-3" role="list">
        {sorted.map((a) => (
          <li key={a.id}>
            <article
              className={`rounded-xl border px-3 py-3 ${kindStyles(a.kind)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {a.title}
                </h3>
                <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 ring-1 ring-zinc-600">
                  {kindLabel(a.kind)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {a.body}
              </p>
              <time
                className="mt-2 block text-[10px] text-zinc-600"
                dateTime={a.createdAt}
              >
                {new Date(a.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
