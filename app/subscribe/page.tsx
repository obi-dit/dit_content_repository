"use client";

import { useState, useEffect } from "react";
import AgeGate from "../components/subscribe/AgeGate";
import SubscribeNav from "../components/subscribe/SubscribeNav";
import SubscribeHero from "../components/subscribe/SubscribeHero";
import PodcastShowcase from "../components/subscribe/PodcastShowcase";
import Perks from "../components/subscribe/Perks";
import Pricing from "../components/subscribe/Pricing";
import SubscribeFooter from "../components/subscribe/SubscribeFooter";

const AGE_VERIFIED_KEY = "dit_age_verified";

export default function SubscribePage() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem(AGE_VERIFIED_KEY);

    if (stored === "true") {
      setAgeVerified(true);
    }
  }, []);

  const handleAgeVerified = () => {
    sessionStorage.setItem(AGE_VERIFIED_KEY, "true");
    setAgeVerified(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {!ageVerified && <AgeGate onVerified={handleAgeVerified} />}

      <SubscribeNav />
      <SubscribeHero />
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-500/90">
              Preview the Experience
            </p>
            <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl">
              See What&apos;s Inside
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30">
            <iframe
              src="https://player.cloudinary.com/embed/?cloud_name=dras72eso&public_id=Creater_a_Video_Ad_bvm6lc"
              title="DIT Podcast Lounge video preview"
              className="aspect-video w-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <PodcastShowcase />
      <Perks />
      <Pricing />
      <SubscribeFooter />
    </div>
  );
}
