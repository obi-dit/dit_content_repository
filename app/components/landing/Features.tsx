"use client";

import { useEffect, useRef, useState } from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "",
    title: "Production & Training Hub",
    description:
      "Serves as a comprehensive hub for DIT's AI Essentials and Technology Programs, providing both production capabilities and training resources.",
  },
  {
    icon: "",
    title: "Digital Content Library",
    description:
      "Capture, store, and manage original digital content including podcasts, AI-based media, video tutorials, and capstone projects.",
  },
  {
    icon: "",
    title: "Hands-On Experience",
    description:
      "Provides real work experience and internships for students ages 14–17 enrolled in DIT's AI Technology and AI Essentials Programs.",
  },
  {
    icon: "",
    title: "Secured Infrastructure",
    description:
      "Operate within DIT's fully secured infrastructure with no reliance on external systems, ensuring data privacy and security.",
  },
];

export default function Features() {
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
      id="features"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-800 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            What We Offer
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A comprehensive platform designed to empower the next generation of
            AI content creators
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                visibleItems.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
