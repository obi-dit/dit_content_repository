"use client";

import { useEffect, useRef, useState } from "react";

interface Show {
  title: string;
  description: string;
  episodes: number;
  category: string;
  icon: string;
}

const shows: Show[] = [
  {
    title: "After Hours Lounge",
    description:
      "Late-night conversations with captivating women who share their unfiltered stories, dating insights, and what really catches their attention.",
    episodes: 48,
    category: "Interview",
    icon: "🌙",
  },
  {
    title: "The Gentleman's Code",
    description:
      "Master the art of attraction, confidence, and style. Expert guests break down what works in modern dating for the mature man.",
    episodes: 36,
    category: "Lifestyle",
    icon: "🎩",
  },
  {
    title: "Meet & Mingle Live",
    description:
      "Exclusive recorded meet-up events where subscribers connect with amazing ladies in real social settings. Watch how it's done.",
    episodes: 24,
    category: "Live Events",
    icon: "🥂",
  },
  {
    title: "Straight Talk Sessions",
    description:
      "No sugarcoating. Honest conversations about relationships, what women really want, and how to bring your A-game after 40.",
    episodes: 52,
    category: "Discussion",
    icon: "🎯",
  },
  {
    title: "The Upgrade Podcast",
    description:
      "Fitness, fashion, finance, and finesse. Everything you need to level up your lifestyle and become the man she can't ignore.",
    episodes: 40,
    category: "Self-Improvement",
    icon: "💪",
  },
  {
    title: "Chemistry Lab",
    description:
      "Deep dives into the science of attraction, body language, and building genuine connections that go beyond the surface.",
    episodes: 30,
    category: "Education",
    icon: "⚡",
  },
];

export default function PodcastShowcase() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll("[data-index]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="shows"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Featured Shows
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Premium podcast and video content created exclusively for our
            subscribers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {shows.map((show, index) => (
            <div
              key={index}
              data-index={index}
              className={`p-6 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 hover:border-amber-600/40 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-500 transform hover:-translate-y-2 ${
                visibleItems.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{show.icon}</span>
                <span className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 text-xs font-semibold border border-amber-800/30">
                  {show.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-zinc-50 mb-2">
                {show.title}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {show.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  {show.episodes} episodes
                </span>
                <span className="text-amber-400 font-medium">
                  Subscribers Only
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
