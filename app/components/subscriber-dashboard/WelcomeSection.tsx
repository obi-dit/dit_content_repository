"use client";

import { User } from "@/typings/auth";
import { SubscriptionStatus } from "@/typings/podcast";

interface WelcomeSectionProps {
  user: User | null;
  subscription: SubscriptionStatus | null;
}

export default function WelcomeSection({
  user,
  subscription,
}: WelcomeSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="relative pt-8 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                {user?.firstName || "Subscriber"}
              </span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg">
              Your exclusive content is ready. Dive in.
            </p>
          </div>

          {subscription?.isActive && (
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-sm">
                  <span className="text-zinc-400">Plan: </span>
                  <span className="text-zinc-100 font-semibold">
                    {subscription.plan}
                  </span>

                  {subscription.expiresAt && (
                    <>
                      <span className="text-zinc-600 mx-2">·</span>
                      <span className="text-zinc-500">
                        Renews {formatDate(subscription.expiresAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
