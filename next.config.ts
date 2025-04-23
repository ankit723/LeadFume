import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['utfs.io',"cdn.jsdelivr.net" , "avatars.githubusercontent.com","img.clerk.com", "oqaoqohtxtswvtgadffs.supabase.co"],
  },
  // Add proper handling for 404 pages
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/_not-found',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
