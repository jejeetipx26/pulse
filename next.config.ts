import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan HP membuka server dev lewat Wi-Fi. Ganti dengan IPv4 laptop kamu (hasil `ipconfig`).
  allowedDevOrigins: ["192.168.1.7"],

  // Wajib: memuat Tailwind lewat Turbopack (bawaan create-next-app). Jangan dihapus.
  turbopack: {
    rules: {
      "*.css": { as: "*.css", loaders: ["@tailwindcss/turbopack"] },
    },
  },
};

export default nextConfig;
