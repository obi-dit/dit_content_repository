"use client";

import Link from "next/link";

export default function Footer() {
  const shouldShowAuth = process.env.NEXT_PUBLIC_SHOW_AUTH === "true";
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900 dark:bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">
              DIT Tech Digital Studios
            </h3>
            <p className="text-sm leading-relaxed">
              A fully self-contained, web-based AI-driven Digital Content
              Library for the next generation of creators.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="hover:text-white transition-colors inline-block"
                >
                  Benefits
                </Link>
              </li>
              {shouldShowAuth && (
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors inline-block"
                  >
                    Sign In
                  </Link>
                </li>
              )}
              {shouldShowAuth && (
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-white transition-colors inline-block"
                  >
                    Sign Up
                  </Link>
                </li>
              )}
              {shouldShowAuth && (
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors inline-block"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors cursor-default">
                AI Essentials Program
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                AI Technology Program
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Digital Content Creation
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Student Internships
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>For Students Ages 14-17</li>
              <li>DIT Technology Programs</li>
              <li className="pt-2">
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Get Started →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 text-center text-sm">
          <p>© 2024 DIT Tech Digital Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
