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
    <div className="min-h-screen bg-[#0a0a0a]">
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
