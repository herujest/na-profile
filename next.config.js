/** @type {import('next').NextConfig} */
const path = require('path');

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
  webpack: (config, { isServer }) => {
    // Exclude GSAP from server-side bundle (GSAP is client-side only)
    if (isServer) {
      // Create a mock GSAP module for server-side
      const mockPath = path.resolve(__dirname, 'webpack/gsap-server-mock.js');
      config.resolve.alias = {
        ...config.resolve.alias,
        'gsap': mockPath,
        'gsap/ScrollTrigger': mockPath,
      };
    }
    return config;
  },
}

module.exports = nextConfig
