import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (mock property images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Mercado Libre / Portal Inmobiliario CDN
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "mlstatic.com",
      },
      {
        protocol: "http",
        hostname: "http2.mlstatic.com",
      },
    ],
  },
};

export default nextConfig;
