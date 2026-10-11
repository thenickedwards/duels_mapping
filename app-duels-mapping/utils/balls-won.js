import { MIN_NINETIES_FOR_AVERAGES } from "@/utils/request-context";

// Balls won: tackles won, aerial duels won and interceptions. Not "turnovers" -- a won
// duel can still end with the ball out of play or back with the opponent -- but each is
// the player winning the ball. Shared by the leaderboard, the fact sheet and the donut.
export const BALLS_WON_FIELDS = ["tackles_won", "aerial_duels_won", "interceptions"];

export const ballsWon = (row) =>
  BALLS_WON_FIELDS.reduce((sum, field) => sum + (Number(row?.[field]) || 0), 0);

export const ballsWonPer90 = (row) => {
  const nineties = Number(row?.nineties) || 0;
  return nineties > 0 ? ballsWon(row) / nineties : 0;
};

// The leaderboard withholds the rate below the same floor the league averages use, so
// cameo appearances cannot top a per-90 sort. Null sorts last in either direction.
export const ballsWonPer90AboveFloor = (row) =>
  Number(row?.nineties) >= MIN_NINETIES_FOR_AVERAGES ? ballsWonPer90(row) : null;
