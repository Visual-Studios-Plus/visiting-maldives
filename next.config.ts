import type { NextConfig } from "next";

import { storageEndpoint } from "./lib/storage-endpoint";

// Uploaded photos live in Neon Object Storage (bucket "site-photos"). Allow next/image to load
// them from this branch's storage host only, and only from that bucket. A badly pasted value
// (quotes, missing https://) is cleaned up; an unusable one switches photo storage off with a
// warning instead of failing the whole build.
const endpoint = storageEndpoint();
if (process.env.AWS_ENDPOINT_URL_S3 && !endpoint) {
  console.warn("[storage] AWS_ENDPOINT_URL_S3 is set but isn't a valid https URL; photo uploads are off until it's fixed.");
}
const storage = endpoint ? new URL(endpoint) : null;

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
  // "Ari Atoll" was split into its two administrative atolls; old links land on the atolls list
  async redirects() {
    return [{ source: "/atolls/ari", destination: "/atolls", permanent: true }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Wikimedia Commons photos (credited on /credits), e.g. the Haa Alif island pages
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
      { protocol: "https", hostname: "thumb.wikimedia.org", pathname: "/wikipedia/commons/**" },
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
