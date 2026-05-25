import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match the legacy WordPress URL shape (every page has a trailing slash)
  // so existing SEO equity / inbound links keep working.
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
