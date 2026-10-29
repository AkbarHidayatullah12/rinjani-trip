import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Aktifkan format modern untuk foto asli nanti (taruh di /public)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
