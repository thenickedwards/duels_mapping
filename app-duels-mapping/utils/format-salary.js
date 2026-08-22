// Salary figures are absent for any player the MLSPA release for that season did not
// list -- most often someone who left the league before the release was compiled. Both
// the leaderboard and the player modal show an em dash for those rather than a zero,
// so the "no data" case reads differently from "earned nothing".
const NO_VALUE = "—";

export function formatSalary(value) {
  if (value == null) return NO_VALUE;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// Schmetzer Score earned per $1M of guaranteed compensation: how much contested
// possession the club bought with what it committed to the player.
export function formatValueMetric(value) {
  if (value == null) return NO_VALUE;
  return value.toLocaleString("en-US");
}
