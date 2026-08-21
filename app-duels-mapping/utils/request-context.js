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

// // One "90" is one game's worth of minutes -- the unit the warehouse stores //
export const MINUTES_PER_NINETY = 90;

// // Resolve the leaderboard's optional minimum-playing-time filter to 90s //
//
// The warehouse stores `nineties` (minutes / 90), but the dashboard control is
// labelled "Minimum Minutes Played" and collects MINUTES, so the two speak
// different units. The UI sent `minMinutes` while the route only ever read
// `minNineties`, which meant the filter was accepted, shown as an active filter
// chip, and then silently ignored.
//
// Accept both spellings and normalise here: `minNineties` is the documented API
// contract and wins when supplied; `minMinutes` is what the UI asks for and is
// converted. Returns null when there is no usable floor, so callers can tell
// "no filter" apart from a floor of 0.
export function resolveMinNineties({ minNineties, minMinutes } = {}) {
  const parse = (raw) => {
    if (raw === null || raw === undefined || String(raw).trim() === "")
      return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const explicit = parse(minNineties);
  if (explicit !== null) return explicit;

  const minutes = parse(minMinutes);
  return minutes === null ? null : minutes / MINUTES_PER_NINETY;
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
