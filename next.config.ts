import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "avatar.iran.liara.run" }],
  },
};

export default nextConfig;
