import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/gov-dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
