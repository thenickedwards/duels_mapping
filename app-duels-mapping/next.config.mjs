/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reverse proxy for PostHog, used by instrumentation-client.js.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Short link for the one-sheet PDF (source lives in planning/one-sheet/).
  async redirects() {
    return [
      { source: "/one-sheet", destination: "/duels-mapping-one-sheet.pdf", permanent: false },
      { source: "/one-sheet/", destination: "/duels-mapping-one-sheet.pdf", permanent: false },
    ];
  },
  // PostHog's API relies on trailing slashes; don't let Next redirect them away.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
