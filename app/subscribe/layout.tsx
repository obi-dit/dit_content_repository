import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIT Podcast Lounge — Premium 18+ Content for Men Over 40",
  description:
    "Exclusive podcast and video repository featuring unfiltered conversations, meet-ups, and connections. Subscribe for $50/mo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
