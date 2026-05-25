import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match the legacy WordPress URL shape (every page has a trailing slash)
  // so existing SEO equity / inbound links keep working.
  trailingSlash: true,
};

export default nextConfig;
