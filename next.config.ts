import type { NextConfig } from "next";
require('dotenv').config();

const nextConfig: NextConfig = {
  experimental: {
      turbo: {} // Enable Turbopack
    },
};

export default nextConfig;
