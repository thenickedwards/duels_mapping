// Shared by the page metadata (layout.js) and the topline explainer.
// The preview is the first sentence, shown (without its period) when collapsed.
export const SITE_DESCRIPTION_PREVIEW =
  "Duels Mapping measures and compares MLS player performance in the fundamental tactic of winning the ball";

export const SITE_DESCRIPTION_SUMMARY =
  "Each player's aerial duels won vs lost, tackles won, interceptions, and recoveries are weighted to calculate a metric for contesting possession called the Schmetzer Score.";

// Only the explainer shows these, as a bulleted list; link previews would truncate them.
export const SITE_BONUS_FEATURES = [
  "Comparisons Tab - 1v1 player match-ups",
  "Salary Data - club spending per player contribution to possession",
  "Tuning Button - customize stat weights",
];

export const SITE_DESCRIPTION = `${SITE_DESCRIPTION_PREVIEW}. ${SITE_DESCRIPTION_SUMMARY}`;
