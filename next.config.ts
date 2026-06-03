import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.0.227"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
