"use client";

import { useEffect, useRef, useState } from "react";
import { Podcast } from "@/typings/podcast";
import PodcastCard from "./PodcastCard";

interface PodcastGridProps {
  podcasts: Podcast[];
  title: string;
  subtitle?: string;
}

export default function PodcastGrid({
  podcasts,
  title,
  subtitle,
}: PodcastGridProps) {
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
  }, [podcasts]);

  if (podcasts.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              No podcasts available yet
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Stay tuned — new episodes are added weekly. Check back soon for
              fresh content.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
            {title}
          </h2>

          {subtitle && (
            <p className="text-zinc-400 text-base">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast, index) => (
            <div key={podcast.id} data-index={index}>
              <PodcastCard
                podcast={podcast}
                index={index}
                isVisible={visibleItems.has(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
