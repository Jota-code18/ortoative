import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP reduzem bastante o peso das fotos de pacientes e equipe
    formats: ["image/avif", "image/webp"],
  },
  // Evita o aviso de múltiplos lockfiles (existe um package-lock.json em ~)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
