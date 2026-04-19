"use client";

import Link from "next/link";
import SubscribeNav from "../../../components/subscribe/SubscribeNav";
import SubscribeFooter from "../../../components/subscribe/SubscribeFooter";

export default function SubscribeCheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscribeNav />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <div className="max-w-md rounded-2xl border border-amber-800/40 bg-zinc-900/90 p-8 shadow-xl">
          <div className="mb-4 text-4xl" aria-hidden>
            ✓
          </div>
          <h1 className="text-2xl font-bold text-zinc-50">Payment successful</h1>
          <p className="mt-3 text-zinc-400">
            Your subscription is active. Sign in with the email and password you created to open
            your subscriber dashboard.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Sign in
          </Link>
          <Link
            href="/subscriber-dashboard"
            className="mt-3 block text-sm text-amber-400/90 hover:text-amber-300"
          >
            Go to dashboard (after signing in)
          </Link>
        </div>
      </main>
      <SubscribeFooter />
    </div>
  );
}
