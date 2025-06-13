import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30
    }
  },
  serverExternalPackages: ["@node-rs/argon2"],
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
