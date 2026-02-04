import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zocpqnvxdgjnemwwtguj.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zocpqnvxdgjnemwwtguj.supabase.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '/**',
      },
      // ❌ DO NOT USE: hostname: "*.supabase.co"  (invalid in Next 15/16 validation)
      // ✅ Add your exact Supabase hostname instead (see below)
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;