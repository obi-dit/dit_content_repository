"use client";

import { useEffect, useRef, useState } from "react";

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const capabilities = [
    "Capture, store, and manage original digital content — including podcasts, AI-based media, video tutorials, and capstone projects",
    "Provide hands-on work experience and internships for students ages 14–17 enrolled in DIT's AI Technology and AI Essentials Programs",
    "Serve as a production and training hub for DIT's AI Essentials and Technology Programs",
    "Operate within DIT's fully secured infrastructure with no reliance on external systems",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            A Creative Technology Ecosystem
          </h2>
          <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed">
            This initiative turns DIT into a creative technology ecosystem where
            youth can build professional portfolios and earn income as AI
            Content Creators and Digital Editors, all while operating within
            DIT's secured infrastructure with no reliance on external systems.
          </p>
        </div>
        <div
          className={`bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-zinc-200 dark:border-zinc-700 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Key Capabilities
          </h3>
          <ul className="space-y-4">
            {capabilities.map((capability, index) => (
              <li
                key={index}
                className="flex items-start gap-3 sm:gap-4 text-zinc-700 dark:text-zinc-300 group"
              >
                <span className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl flex-shrink-0 transform group-hover:scale-125 transition-transform">
                  ✓
                </span>
                <span className="text-sm sm:text-base leading-relaxed">
                  {capability}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
