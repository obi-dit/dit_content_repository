"use client";

export default function SubscribeFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">
              DIT Podcast Lounge
            </h3>
            <p className="text-sm leading-relaxed">
              Premium 18+ podcast and video content for men over 40 who know
              what they want.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Shows</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#shows"
                  className="hover:text-white transition-colors inline-block"
                >
                  After Hours Lounge
                </a>
              </li>
              <li>
                <a
                  href="#shows"
                  className="hover:text-white transition-colors inline-block"
                >
                  The Gentleman&apos;s Code
                </a>
              </li>
              <li>
                <a
                  href="#shows"
                  className="hover:text-white transition-colors inline-block"
                >
                  Meet &amp; Mingle Live
                </a>
              </li>
              <li>
                <a
                  href="#shows"
                  className="hover:text-white transition-colors inline-block"
                >
                  View All Shows
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Subscribe</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors inline-block"
                >
                  Monthly Plan
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors inline-block"
                >
                  Quarterly Plan
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors inline-block"
                >
                  Annual Plan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Content Policy (18+)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center text-sm">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} DIT Podcast Lounge. All rights
            reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            This site contains content intended for adults aged 18 and over.
          </p>
        </div>
      </div>
    </footer>
  );
}
