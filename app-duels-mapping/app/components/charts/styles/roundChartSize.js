// Shared size for the round charts that sit side by side in the player dialog
// (turnovers donut, aerial duels pie). Chart.js otherwise sizes each circle to its
// own leftover canvas space, so a taller header or a wrapped legend in one tile
// would give the two circles different diameters.
export const ROUND_CHART_HEIGHT = 250; // canvas height, legend included
export const ROUND_CHART_RADIUS = 90; // px; fits the canvas even with a two-row legend
