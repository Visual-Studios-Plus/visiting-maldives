import type { NextConfig } from "next";

// Uploaded photos live in Neon Object Storage (bucket "site-photos"). Allow next/image to load
// them from this branch's storage host only, and only from that bucket.
const storage = process.env.AWS_ENDPOINT_URL_S3 ? new URL(process.env.AWS_ENDPOINT_URL_S3) : null;

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: {
      // Dashboard photo uploads: photos are resized in the browser to well under 4 MB first;
      // this leaves room for form overhead and stays below Vercel's 4.5 MB request limit.
      bodySizeLimit: "4.4mb",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(storage ? [{ protocol: "https" as const, hostname: storage.hostname, pathname: "/site-photos/**" }] : []),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
