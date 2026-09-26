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
  // PostHog's API relies on trailing slashes; don't let Next redirect them away.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
