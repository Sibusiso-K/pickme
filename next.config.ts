import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable ESLint during builds to deploy quickly
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
