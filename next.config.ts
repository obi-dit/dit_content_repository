import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for file uploads (default is 10MB)
  // Video uploads go direct to backend in browser; these limits apply if any path uses proxy/middleware
  experimental: {
    proxyTimeout: 300000, // 5 minutes for large uploads when request goes through rewrite
    serverActions: {
      bodySizeLimit: "310mb",
    },
    // Allow 300MB uploads when request goes through Next.js proxy (rewrites)
    proxyClientMaxBodySize: "310mb",
  },

  // Proxy API requests to the backend server
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
