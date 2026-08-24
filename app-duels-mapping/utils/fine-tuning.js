import dataVars from "@/public/duels_mapping_data/data_vars.json";
import { MIN_NINETIES_FOR_AVERAGES } from "@/utils/request-context";

/*
Fine tuning of the Schmetzer Score.

The warehouse scores and ranks every player at the weights in data_vars.json, and the
API serves those figures. This module re-does that arithmetic in the browser so the
Fine Tuning drawer can hand the user their own weights and have the leaderboard, the
ranks, the value metric and the player dialog all move with them. Nothing here writes
to the database -- a tuned view lasts until the page is reloaded.

It is imported by client components, so it reads data_vars.json as a module rather
than off disk. That keeps the weights, the abbreviations and the value-metric basis
on the same single source of truth the ETL uses.
*/

const POINTS = dataVars.schmetzer_score_points;

// Which salary figure the value metric divides by, and per how many dollars.
const VALUE_METRIC_BASIS = dataVars.salary.value_metric_basis;
const VALUE_PER_DOLLARS = dataVars.salary.value_per_dollars;
const MIN_NINETIES_FOR_VALUE_RANK = dataVars.salary.min_nineties_for_value_rank;

const toTitleCase = (str) =>
  str.replace(/\b\w/g, (character) => character.toUpperCase());

/*
The five weighted statistics, in the order data_vars.json lists them -- which is the
order the drawer shows them in.

`stat` is the spaced name the weights are keyed under ("aerial duels won"), because
that is how data_vars.json and dim_schmetzer_score_points spell it. `field` is the
underscored column the same statistic arrives on in a player row.
*/
export const SCHMETZER_STATS = Object.entries(POINTS).map(([stat, meta]) => ({
  stat,
  field: stat.replace(/ /g, "_"),
  label: toTitleCase(stat),
  abbrev: meta.abbrev,
  defaultWeight: meta.point_value,
}));

export const DEFAULT_SCHMETZER_WEIGHTS = Object.fromEntries(
  SCHMETZER_STATS.map(({ stat, defaultWeight }) => [stat, defaultWeight]),
);

/*
Round to 2dp on the way out, the way the scoring SQL does.

Weights such as -0.85 and 0.9 have no exact binary float representation, so a score
summed from them lands on values like 121.39999999999998. The stored scores are
rounded, so a tuned score has to be too or the same weights would render differently
depending on whether they came from the database or from here.
*/
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// // The Schmetzer Score a player's raw counts earn at a given set of weights //
export function schmetzerScoreFrom(weights, playerData) {
  let score = 0;
  for (const { stat, field } of SCHMETZER_STATS) {
    const weight = Number(weights?.[stat]);
    if (!Number.isFinite(weight)) continue;
    score += (Number(playerData?.[field]) || 0) * weight;
  }
  return round2(score);
}

/*
The helper function below allows for fine tuning of the Schmetzer Score. Two arguments
are accepted: newConfig and playerData.

The newConfig variable should be an object with the values that are sent from the fine
tuning controls. For example:
const newConfig = {
  "aerial duels won": 3,
  "aerial duels lost": 0,
  "tackles won": 2,
  interceptions: 1,
  recoveries: 0,
};
Note: The newConfig variable is optional. If you don't pass a newConfig value to the
function, the default values in data_vars.json are used.

The playerData variable should be similar but include the player_name and the player's
raw stats. For example:
const playerData = {
  player_name: "Yeimar Gómez Andrade",
  aerial_duels_won: 25,
  aerial_duels_lost: 16,
  tackles_won: 24,
  interceptions: 20,
  recoveries: 68,
};

The return will be an object with two key-value-pairs: player_name and newScore. For
example:
{ player_name: 'Yeimar Gómez Andrade', newScore: 143 }
*/
export function tuneSchmetzerScore(
  newConfig = DEFAULT_SCHMETZER_WEIGHTS,
  playerData,
) {
  return {
    player_name: playerData?.player_name,
    newScore: schmetzerScoreFrom(newConfig, playerData),
  };
}

/*
Competition ranking, the way RANK() OVER (ORDER BY ... DESC) assigns it in the scoring
SQL: tied players share the better rank and the ranks after them skip. Mutates the rows
it is handed, which are always copies made by retuneSeason below.
*/
function assignRanks(rows, scoreField, rankField) {
  const ordered = [...rows].sort((a, b) => b[scoreField] - a[scoreField]);

  let rank = 0;
  let previousScore = null;
  ordered.forEach((row, index) => {
    if (row[scoreField] !== previousScore) {
      rank = index + 1;
      previousScore = row[scoreField];
    }
    row[rankField] = rank;
  });
}

/*
Re-score and re-rank a whole season at a custom set of weights, returning fresh rows.

Hand this every player in the season rather than the rows currently on screen. A
schmetzer_rk is a season-wide standing -- the player dialog reads it as "#rank of N" --
so ranking a filtered subset would quietly renumber the league from whatever the grid
happened to be showing.
*/
export function retuneSeason(weights, seasonRows = []) {
  const tuned = seasonRows.map((row) => ({
    ...row,
    schmetzer_score: schmetzerScoreFrom(weights, row),
  }));

  assignRanks(tuned, "schmetzer_score", "schmetzer_rk");

  // Value metric: how much contested possession the club bought with the money it
  // committed to the player. Only players the MLSPA release listed have a basis.
  for (const row of tuned) {
    const basis = Number(row[VALUE_METRIC_BASIS]);
    row.schmetzer_score_per_million =
      basis > 0 ? round2(row.schmetzer_score / (basis / VALUE_PER_DOLLARS)) : null;
    row.schmetzer_value_rk = null;
  }

  // Ranked only past the minutes floor, matching the pipeline: below it a single
  // substitute appearance on a league-minimum contract tops the table on a few duels.
  assignRanks(
    tuned.filter(
      (row) =>
        row.schmetzer_score_per_million !== null &&
        Number(row.nineties) >= MIN_NINETIES_FOR_VALUE_RANK,
    ),
    "schmetzer_score_per_million",
    "schmetzer_value_rk",
  );

  return tuned;
}

/*
Re-derive the league Schmetzer average and maximum from tuned rows.

The player dialog plots a score against both, so leaving them at the served figures
would show a tuned score against an untuned league. Everything else on seasonStats is
raw counts and is unaffected. The minutes floor is the one the API applies, so a
handful of cameo appearances cannot drag the tuned mean down either.
*/
export function retuneSeasonStats(seasonStats, tunedRows = []) {
  const base = Array.isArray(seasonStats) ? seasonStats[0] : seasonStats;
  if (!base) return seasonStats;

  const counted = tunedRows.filter(
    (row) => Number(row.nineties) >= MIN_NINETIES_FOR_AVERAGES,
  );
  if (!counted.length) return seasonStats;

  const scores = counted.map((row) => row.schmetzer_score);
  const tuned = {
    ...base,
    smetz_max: round2(Math.max(...scores)),
    smetz_avg: round2(scores.reduce((sum, score) => sum + score, 0) / scores.length),
  };

  return Array.isArray(seasonStats) ? [tuned] : tuned;
}

/*
The drawer holds what the user typed rather than a number: mid-edit values such as ""
or "-" have to survive a keystroke without collapsing into something else. Parse on the
way out and read anything unusable as 0 -- a statistic with no weight simply stops
counting, which is a legitimate thing to want to see.
*/
export const defaultWeightInputs = () =>
  Object.fromEntries(
    SCHMETZER_STATS.map(({ stat, defaultWeight }) => [
      stat,
      String(defaultWeight),
    ]),
  );

export function parseWeightInputs(inputs) {
  return Object.fromEntries(
    SCHMETZER_STATS.map(({ stat }) => {
      const weight = Number(inputs?.[stat]);
      return [stat, Number.isFinite(weight) ? weight : 0];
    }),
  );
}

// // How many weights the user has moved off their standard value //
export function tunedWeightCount(weights) {
  return SCHMETZER_STATS.filter(
    ({ stat, defaultWeight }) => Number(weights?.[stat]) !== defaultWeight,
  ).length;
}
