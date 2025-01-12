import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ytimg.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
    ], // Add YouTube's image domain
  },
};

export default nextConfig;
