/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "zocpqnvxdgjnemwwtguj.supabase.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "dummyimage.com", pathname: "/**" }
    ],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
  serverExternalPackages: ["@react-pdf/renderer"],
};

module.exports = nextConfig;
