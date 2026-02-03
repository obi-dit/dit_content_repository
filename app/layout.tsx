import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "./components/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIT Digital Studios - AI-Driven Digital Content Library",
  description:
    "A fully self-contained, web-based AI-driven Digital Content Library serving as a production and training hub for DIT's AI Essentials and Technology Programs. Empowering youth ages 14-17 to build professional portfolios and earn income as AI Content Creators.",
  keywords: [
    "AI Content",
    "Digital Content Library",
    "AI Training",
    "Youth Programs",
    "Content Creation",
    "DIT Digital Studios",
    "AI Essentials",
    "Technology Programs",
  ],
  authors: [{ name: "DIT Digital Studios" }],
  creator: "DIT Digital Studios",
  publisher: "DIT Digital Studios",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ditdigitalstudios.com",
    siteName: "DIT Digital Studios",
    title: "DIT Digital Studios - AI-Driven Digital Content Library",
    description:
      "A fully self-contained, web-based AI-driven Digital Content Library serving as a production and training hub for DIT's AI Essentials and Technology Programs. Empowering youth ages 14-17 to build professional portfolios and earn income as AI Content Creators.",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "DIT Digital Studios - AI-Driven Digital Content Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIT Digital Studios - AI-Driven Digital Content Library",
    description:
      "Empowering youth ages 14-17 to build professional portfolios and earn income as AI Content Creators.",
    images: ["/assets/logo.png"],
    creator: "@ditdigitalstudios",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProtectedRoute>{children}</ProtectedRoute>
      </body>
    </html>
  );
}
