import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Classic rendering model: pages are static unless they read request data.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Keep the sprite sheet and other static assets untouched.
  // 90 is used by the portrait photo so it stays crisp.
  images: { formats: ["image/webp"], qualities: [75, 90] },
  // Admin document uploads (PDF/TXT up to 4 MB, under Vercel's 4.5 MB request limit).
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
