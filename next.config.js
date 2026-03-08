/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://zocpqnvxdgjnemwwtguj.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3BxbnZ4ZGdqbmVtd3d0Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzAxMDEsImV4cCI6MjA3ODU0NjEwMX0.PhNMzRjYPIvRf2IVXpJ4Y9PXBn4e41tffPIvreFs86U",
  },
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
