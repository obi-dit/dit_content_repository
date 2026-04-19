import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast library — DIT Podcast Lounge",
  description: "Browse past episodes and watch on demand.",
  robots: { index: false, follow: false },
};

export default function PodcastLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
