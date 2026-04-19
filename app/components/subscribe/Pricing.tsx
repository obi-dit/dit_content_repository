"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { getToken } from "@/utils/auth";

const BENEFITS: { title: string; description: string; icon: ReactNode }[] =
  [
    {
      title: "Live podcast streaming",
      description:
        "Watch every session as it happens—no delays, no paywalls on the feed.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
    },
    {
      title: "All featured women",
      description:
        "Full access to every featured guest—profiles, appearances, and exclusives in one place.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
    },
    {
      title: "Ask questions live",
      description:
        "Join the conversation—submit questions during live sessions and hear real answers.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.758.214-7.055.628C3.373 3.861 2.25 5.255 2.25 6.857V16.5Z"
          />
        </svg>
      ),
    },
  ];

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const ctaHref = isLoggedIn ? "/subscriber-dashboard" : "/subscribe/checkout";
  const ctaLabel = isLoggedIn ? "Go to dashboard" : "Subscribe Now";

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 scroll-mt-20 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="mb-4 inline-block rounded-full border border-amber-800/40 bg-amber-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
            One membership · Full access
          </span>
          <h2 className="mb-4 text-3xl font-bold text-zinc-50 sm:text-4xl md:text-5xl">
            Simple pricing.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Serious value.
            </span>
          </h2>
          <p className="text-lg text-zinc-400 sm:text-xl">
            Everything you need to stream live, explore every featured guest,
            and participate when it counts—one clear price.
          </p>
        </div>

        <div
          className={`mx-auto max-w-xl transition-all duration-700 delay-150 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative rounded-3xl border border-amber-600/35 bg-gradient-to-b from-amber-950/50 via-zinc-900/95 to-zinc-950 p-px shadow-2xl shadow-amber-950/40">
            <div className="rounded-[1.4rem] bg-zinc-900/90 p-8 sm:p-10">
              <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-amber-400/90">
                    Member access
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-zinc-50">
                    Full Lounge Pass
                  </h3>
                </div>
                <div className="mt-6 sm:mt-0">
                  <div className="flex items-baseline justify-center gap-1 sm:justify-end">
                    <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                      $50
                    </span>
                    <span className="text-lg text-zinc-400">/month</span>
                  </div>
                  <p className="mt-1 text-center text-sm text-zinc-500 sm:text-right">
                    Billed monthly · Cancel anytime
                  </p>
                </div>
              </div>

              <ul className="mb-10 space-y-4">
                {BENEFITS.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-800/40 p-4 transition-colors hover:border-amber-900/40 hover:bg-zinc-800/60"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 text-amber-400 ring-1 ring-amber-700/30">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-semibold text-zinc-100">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href={ctaHref}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:shadow-amber-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                {ctaLabel}
                <span
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>

              <p className="mt-5 text-center text-xs text-zinc-500">
                Secure checkout · Discreet billing on your statement
              </p>
            </div>
          </div>
        </div>

        <p
          className={`mt-10 text-center text-sm text-zinc-600 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          18+ only. By subscribing you agree to our terms and content policies.
        </p>
      </div>
    </section>
  );
}
