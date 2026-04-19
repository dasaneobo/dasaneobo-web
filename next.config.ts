import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    KAMIS_API_KEY: process.env.KAMIS_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
