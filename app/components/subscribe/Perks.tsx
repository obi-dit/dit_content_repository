"use client";

import { useEffect, useRef, useState } from "react";

interface Perk {
  icon: string;
  title: string;
  description: string;
}

const perks: Perk[] = [
  {
    icon: "🎬",
    title: "Exclusive Video Content",
    description:
      "Full-length episodes, behind-the-scenes footage, and bonus clips you won't find on free platforms.",
  },
  {
    icon: "🎙️",
    title: "Weekly New Episodes",
    description:
      "Fresh podcast episodes every week across all our shows, so you never run out of content.",
  },
  {
    icon: "👋",
    title: "Meet-Up Access",
    description:
      "Invitations to recorded live events and meet-and-greet sessions with featured guests.",
  },
  {
    icon: "💬",
    title: "Members-Only Community",
    description:
      "Connect with other subscribers, share experiences, and get advice from men who've been there.",
  },
  {
    icon: "📱",
    title: "Watch Anywhere",
    description:
      "Stream on any device — phone, tablet, laptop, or TV. Your content goes wherever you go.",
  },
  {
    icon: "🔒",
    title: "100% Private & Discreet",
    description:
      "Your subscription is completely private. Billing appears as a generic charge on your statement.",
  },
];

export default function Perks() {
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

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            What You Get
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Your subscription unlocks the full experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl bg-zinc-800/50 border border-zinc-700/50 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-3">{perk.icon}</div>
              <h3 className="text-lg font-bold text-zinc-50 mb-2">
                {perk.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
