import type { Metadata } from "next";
import SubscriptionAccessGate from "../components/subscriber-dashboard/SubscriptionAccessGate";

export const metadata: Metadata = {
  title: "Subscriber Dashboard — DIT Podcast Lounge",
  description:
    "Your exclusive subscriber dashboard. Access live podcasts, recent episodes, and premium content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionAccessGate>{children}</SubscriptionAccessGate>;
}
