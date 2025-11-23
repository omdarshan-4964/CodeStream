import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Environment variables that should be available in the browser
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
  },
  
  // TypeScript config
  typescript: {
    // Set to true only if you want production builds to succeed even with TS errors
    ignoreBuildErrors: false,
  },
  
  // Output standalone for easier Docker/serverless deployment
  output: 'standalone',
};

export default nextConfig;
