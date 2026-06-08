import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match the legacy WordPress URL shape (every page has a trailing slash)
  // so existing SEO equity / inbound links keep working.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "quadbiketourism.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.quadbiketourism.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
