// // Shared request-context helpers for the API routes //
//
// Every /api/schmetzer_scores* route picks its data source at request time from
// the hostname: local hosts read the SQLite warehouse on disk, everything else
// reads the Supabase mirror. That decision used to be re-implemented inline in
// each route, and the copies drifted -- only the leaderboard route recognised a
// 192.168.x.x LAN address, so browsing a dev server over LAN read the grid from
// SQLite and the player detail dialog from Supabase in the same session.
// Keep the rule here so the routes cannot disagree again.

const LOCAL_HOST_PATTERNS = ["localhost", "127.0.0.1", "192.168."];

// // True when the request was served from a local/dev host //
export function isLocalHost(host) {
  if (!host) return false;
  return LOCAL_HOST_PATTERNS.some((pattern) => host.includes(pattern));
}

// // Minimum 90s (games' worth of minutes) a player must have logged to be
// // included in any SEASON AVERAGE or league aggregate.
// //
// // Averages only -- players below this floor are still scored and still ranked
// // on the leaderboard; excluding them just keeps a handful of cameo
// // appearances from dragging the league mean. Both the SQLite template
// // (utils/sql/select/schmetzer_scores_season_info.sql) and the Supabase branch
// // must apply the same floor or local and deployed builds report different
// // averages for the same season.
export const MIN_NINETIES_FOR_AVERAGES = 5;
