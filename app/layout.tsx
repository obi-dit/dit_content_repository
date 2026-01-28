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
