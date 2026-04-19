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
      <PodcastShowcase />
      <Perks />
      <Pricing />
      <SubscribeFooter />
    </div>
  );
}
