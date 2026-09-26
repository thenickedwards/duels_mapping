import posthog from "posthog-js";

// Skipped when the key is missing so local dev without a .env doesn't error.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // Routed through our own domain (see rewrites in next.config.mjs) so ad blockers don't drop events.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // Captures pageviews on client-side route changes as well as full loads.
    defaults: "2025-05-24",
    person_profiles: "identified_only",
  });
}
