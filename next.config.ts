import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for file uploads (default is 10MB)
  // 2 minutes
  experimental: {
    proxyTimeout: 12000,
    serverActions: {
      bodySizeLimit: "110mb",
    },
    // Increase middleware client body size limit for proxied requests
    middlewareClientMaxBodySize: "110mb",
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
