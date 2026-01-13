import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Coolify + Docker + Production için GEREKLİ
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
        pathname: "/**",
      },
    ],
  },

  // Next.js 15/16 – default, dokunma
  turbopack: {},
};

export default nextConfig;
