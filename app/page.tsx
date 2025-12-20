"use client";

import Navigation from "./components/landing/Navigation";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import ValueProposition from "./components/landing/ValueProposition";
import Benefits from "./components/landing/Benefits";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <Navigation />
      <Hero />
      <Features />
      <ValueProposition />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}
