"use client";

import Link from "next/link";
import { User } from "@/typings/auth";
import type { SubscriptionStatus } from "@/typings/podcast";

interface ProfileSubscriptionOverviewProps {
  user: User | null;
  subscription: SubscriptionStatus | null;
}

export default function ProfileSubscriptionOverview({
  user,
  subscription,
}: ProfileSubscriptionOverviewProps) {
  const renews = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/60 to-zinc-900/80 p-5"
    >
      <h2 id="profile-heading" className="text-lg font-bold text-zinc-50">
        Profile & subscription
      </h2>

      <div className="mt-4 flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg font-bold text-white"
          aria-hidden
        >
          {user?.firstName?.charAt(0) || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-100">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-sm text-zinc-500">{user?.email}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-700/80 bg-zinc-950/40 p-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              subscription?.isActive ? "bg-green-500" : "bg-zinc-600"
            }`}
            aria-hidden
          />
          <span className="text-sm font-medium text-zinc-300">
            {subscription?.isActive ? "Active membership" : "Inactive"}
          </span>
        </div>
        {subscription?.plan && (
          <p className="mt-2 text-sm text-zinc-400">
            Plan:{" "}
            <span className="font-semibold text-zinc-200">
              {subscription.plan}
            </span>
          </p>
        )}
        {renews && (
          <p className="mt-1 text-xs text-zinc-500">Renews on {renews}</p>
        )}
      </div>

      <Link
        href="/subscribe"
        className="mt-4 block w-full rounded-lg border border-zinc-600 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-amber-700/50 hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        Manage membership
      </Link>
    </section>
  );
}
