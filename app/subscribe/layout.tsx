import type { Metadata } from "next";

const title = "DIT Podcast Lounge - Premium 18+ Content for Men Over 40";
const description =
  "Exclusive podcast and video repository featuring unfiltered conversations, meet-ups, and connections. Subscribe for $50/mo.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "DIT Podcast Lounge",
    "premium podcast",
    "subscriber lounge",
    "exclusive video content",
    "live podcast",
    "men over 40",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/subscribe",
    siteName: "DIT Podcast Lounge",
    title,
    description,
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "DIT Podcast Lounge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/assets/logo.png"],
  },
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
