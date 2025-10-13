import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["your-supabase-project.supabase.co"], // if using Supabase images
  },
  // Ensure API routes work
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
