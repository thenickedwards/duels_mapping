// Salary figures are absent for any player the MLSPA release for that season did not
// list -- most often someone who left the league before the release was compiled. Both
// the leaderboard and the player modal show an em dash for those rather than a zero,
// so the "no data" case reads differently from "earned nothing".
const NO_VALUE = "—";

export function formatSalary(value) {
  if (value == null) return NO_VALUE;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// Guaranteed compensation per Schmetzer point: what the club paid for each point of
// contested possession, so lower is better. Derived here rather than stored, so it
// follows the score under custom weights. Null without a salary on record, and for a
// score of zero or below -- there is nothing bought to divide by, and a negative
// cost would sort as the best value in the league.
export function costPerSmetz(row) {
  const comp = Number(row?.guaranteed_comp);
  const score = Number(row?.schmetzer_score);
  if (row?.guaranteed_comp == null || !(comp > 0) || !(score > 0)) return null;
  return Math.round(comp / score);
}
