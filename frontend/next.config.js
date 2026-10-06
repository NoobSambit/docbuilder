/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Let production QA coexist with an already running development server.
  distDir: process.env.DOCBUILDER_BUILD_DIR || ".next",
  async headers() {
    return [
      {
        source: "/landing/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
