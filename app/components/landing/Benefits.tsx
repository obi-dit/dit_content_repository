"use client";

import { useEffect, useRef, useState } from "react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: "",
    title: "Build Professional Portfolios",
    description:
      "Students can showcase their work and build impressive portfolios that demonstrate their skills as AI Content Creators.",
  },
  {
    icon: "",
    title: "Earn Income",
    description:
      "Opportunities to earn income as AI Content Creators and Digital Editors while learning and creating.",
  },
  {
    icon: "",
    title: "Creative Technology Ecosystem",
    description:
      "DIT becomes a thriving creative technology ecosystem where youth can learn, create, and grow professionally.",
  },
  {
    icon: "",
    title: "Career Development",
    description:
      "Gain valuable experience and skills that prepare students for careers in AI, digital content creation, and technology.",
  },
];

export default function Benefits() {
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
      id="benefits"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-800 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Student Benefits
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Empowering the next generation of digital creators
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              data-index={index}
              className={`p-5 sm:p-6 rounded-xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
                visibleItems.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-4xl mb-4 transform hover:rotate-12 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


