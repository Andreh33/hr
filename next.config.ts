import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Unsplash hot-link CDN — used for food photography until the client
      // delivers their own plate shoots. Free license, commercial OK.
      { protocol: "https", hostname: "images.unsplash.com" },
      // plus.unsplash.com is the same CDN behind paid Unsplash+ pool.
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@phosphor-icons/react"],
  },
};

export default nextConfig;
