// Shared by the page metadata (layout.js) and the topline explainer.
// The preview is the first sentence, shown (without its period) when collapsed.
export const SITE_DESCRIPTION_PREVIEW =
  "Duels Mapping is a dashboard for the Contested Possession Metric a.k.a. the Schmetzer Score";

export const SITE_DESCRIPTION_SUMMARY =
  "Each MLS player's aerial duels won vs lost, tackles won, interceptions, and recoveries are weighted to calculate their score and rank.";

// Only the explainer shows these, as a bulleted list; link previews would truncate them.
export const SITE_BONUS_FEATURES = [
  "Comparisons Tab - 1v1 player match-ups",
  "Salary Data - club spending per player's contributions to possession",
  "Tuning Button - customize stat weights",
];

export const SITE_DESCRIPTION = `${SITE_DESCRIPTION_PREVIEW}. ${SITE_DESCRIPTION_SUMMARY}`;
