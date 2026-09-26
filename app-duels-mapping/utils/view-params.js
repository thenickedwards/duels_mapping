// The shareable part of the Players page -- season, tab, position, squad, minimum
// minutes and sort -- read from and written to the query string. Plain JS with no
// React so the page's generateMetadata can describe a shared link with the same rules
// the page uses to show it.
//
// Everything here treats the URL as untrusted: a hand-edited or stale link falls back
// to the default for any value it cannot use rather than showing an empty or broken
// view. Defaults are left out of the query string, so the bare URL stays clean and a
// link keeps meaning the same thing if a default changes later.
//
// Fine-tuning weights are deliberately NOT part of this -- a shared link always shows
// the published Schmetzer Score, never someone's custom ranking passed off as it.

// Update these when you add new data seasons
export const MAX_SEASON = 2025;
export const MIN_SEASON = 2018;
export const DEFAULT_SEASON = String(MAX_SEASON);

export const TABS = ["players", "comparisons"];
const DEFAULT_TAB = "players";

// Every position code the data holds; see POSITION_OPTIONS on the page.
export const POSITION_CODES = ["FW", "MF", "DF", "GK"];

export const POSITION_LABELS = {
  FW: "Forwards",
  MF: "Midfielders",
  DF: "Defenders",
  GK: "Goalkeepers",
};

// Goalkeepers start deselected; see OUTFIELD_POSITIONS on the page.
export const OUTFIELD_POSITIONS = ["FW", "MF", "DF"];

export const isDefaultPositions = (selected) =>
  selected.length === OUTFIELD_POSITIONS.length &&
  OUTFIELD_POSITIONS.every((code) => selected.includes(code));

// Guards against a crafted link stuffing a preview title with arbitrary text: no real
// selection is near these limits, and club names are letters, digits, spaces and a
// little punctuation ("D.C. United", "CF Montréal"). The page itself also drops any
// name not in the season's data, but the server-side preview cannot see that list.
const MAX_SQUADS = 30;
const MAX_SQUAD_LENGTH = 60;
const SQUAD_NAME = /^[\p{L}\p{N} .'&-]+$/u;

// Accepts URLSearchParams or the plain object a server component gets.
function reader(params) {
  if (typeof params?.get === "function") return (key) => params.get(key);
  return (key) => {
    const value = params?.[key];
    return Array.isArray(value) ? value[0] : (value ?? null);
  };
}

function splitList(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseSeason(value) {
  // Number(null) and Number("") are both 0, which would clamp up to MIN_SEASON.
  if (value === null || value === undefined || String(value).trim() === "")
    return DEFAULT_SEASON;
  const year = Number(value);
  if (!Number.isInteger(year)) return DEFAULT_SEASON;
  return String(Math.min(Math.max(year, MIN_SEASON), MAX_SEASON));
}

// Sort is written "field" for ascending and "-field" for descending.
function parseSort(value) {
  const match = /^(-?)([a-z0-9_]{1,64})$/.exec(value || "");
  if (!match) return null;
  return { field: match[2], sort: match[1] ? "desc" : "asc" };
}

export function parseViewParams(params) {
  const get = reader(params);

  const tab = TABS.includes(get("tab")) ? get("tab") : DEFAULT_TAB;

  // No "pos" means the default outfield view. An explicit empty selection is written
  // as "all" so it survives the round trip instead of snapping back to the default.
  const posParam = get("pos");
  let position;
  if (posParam === null) position = OUTFIELD_POSITIONS;
  else if (posParam === "all") position = [];
  else {
    const codes = splitList(posParam.toUpperCase()).filter((code) =>
      POSITION_CODES.includes(code),
    );
    position = codes.length ? [...new Set(codes)] : OUTFIELD_POSITIONS;
  }

  const squad = [
    ...new Set(
      splitList(get("squad")).filter(
        (name) => name.length <= MAX_SQUAD_LENGTH && SQUAD_NAME.test(name),
      ),
    ),
  ].slice(0, MAX_SQUADS);

  const minutes = Number(get("min"));
  const minMinutes =
    Number.isInteger(minutes) && minutes > 0 ? String(minutes) : "";

  return {
    season: parseSeason(get("season")),
    tab,
    position,
    squad,
    minMinutes,
    sort: parseSort(get("sort")),
  };
}

// The query string for a view, with every default left out.
export function buildViewQuery(view) {
  const query = new URLSearchParams();

  if (view.season && view.season !== DEFAULT_SEASON)
    query.set("season", view.season);
  if (view.tab && view.tab !== DEFAULT_TAB) query.set("tab", view.tab);

  if (view.position && !isDefaultPositions(view.position)) {
    const codes = POSITION_CODES.filter((c) => view.position.includes(c));
    query.set("pos", codes.length ? codes.join(",") : "all");
  }

  if (view.squad?.length) query.set("squad", view.squad.join(","));
  if (view.minMinutes) query.set("min", view.minMinutes);
  if (view.sort?.field && view.sort?.sort)
    query.set(
      "sort",
      `${view.sort.sort === "desc" ? "-" : ""}${view.sort.field}`,
    );

  // URLSearchParams encodes commas as %2C; they are safe in a query string and read
  // far better in a pasted link.
  return query.toString().replace(/%2C/gi, ",");
}

// A one-line summary of a view for link previews, e.g.
// "2024 · Defenders · Seattle Sounders FC · 900+ mins".
export function describeView(view) {
  const parts = [view.season];

  if (view.tab === "comparisons") {
    parts.push("Player Comparisons");
    return parts.join(" · ");
  }

  if (view.position.length && !isDefaultPositions(view.position)) {
    parts.push(
      POSITION_CODES.filter((c) => view.position.includes(c))
        .map((c) => POSITION_LABELS[c])
        .join(" & "),
    );
  }
  if (view.squad.length) {
    parts.push(
      view.squad.length > 3
        ? `${view.squad.slice(0, 3).join(", ")} +${view.squad.length - 3}`
        : view.squad.join(", "),
    );
  }
  if (view.minMinutes) parts.push(`${view.minMinutes}+ mins`);

  return parts.join(" · ");
}
