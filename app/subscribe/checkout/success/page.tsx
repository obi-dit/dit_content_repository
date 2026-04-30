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
          <h1 className="text-2xl font-bold text-zinc-50">
            Payment successful
          </h1>
          <p className="mt-3 text-zinc-400">
            Your payment was received. An admin will review your driver license
            for age verification before dashboard access is enabled.
          </p>
          <Link
            href="/subscribe/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Sign in
          </Link>
          <p className="mt-3 text-xs text-zinc-500">
            If your verification is pending, the dashboard will unlock after approval.
          </p>
        </div>
      </main>
      <SubscribeFooter />
    </div>
  );
}
