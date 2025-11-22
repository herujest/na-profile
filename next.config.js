/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Optimize for Next.js 14
    optimizePackageImports: ["@headlessui/react", "framer-motion"],
  },
  images: {
    // Allow images from external domains (R2/CDN)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Optimize images
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  webpack: (config, { isServer }) => {
    // Exclude GSAP from server-side bundle (GSAP is client-side only)
    if (isServer) {
      // Create a mock GSAP module for server-side
      const mockPath = path.resolve(__dirname, "webpack/gsap-server-mock.js");
      config.resolve.alias = {
        ...config.resolve.alias,
        gsap: mockPath,
        "gsap/ScrollTrigger": mockPath,
      };

      // Allow resolving TypeScript files from .prisma/client
      config.resolve.extensions = [
        ...(config.resolve.extensions || []),
        ".ts",
        ".tsx",
      ];
    }

    // Optimize Prisma client for Next.js 14
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
