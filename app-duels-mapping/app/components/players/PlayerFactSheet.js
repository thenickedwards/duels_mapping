"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { formatSalary, formatValueMetric } from "@/utils/format-salary";
import { nationalityFlag } from "@/utils/nationality-flag";
import { MAX_SEASON, MIN_SEASON } from "@/utils/view-params";
import {
  turnoversWon,
  turnoversWonPer90,
} from "../charts/BallWinningDonutChart";
import { getMuiChartTooltipSlotProps } from "../charts/styles/chartTooltipOptions";

const NO_VALUE = "—";

export default function PlayerFactSheet({ player, season, seasonRows = [] }) {
  const theme = useTheme();
  // Older FBref seasons record age as "years-days"; only the years are wanted.
  const age = player.player_age?.toString().split("-")[0];
  const born = player.player_yob
    ? `${player.player_yob}${age ? ` (${age} YO)` : ""}`
    : NO_VALUE;
  const nationality = player.player_nationality?.trim()
    ? `${player.player_nationality} ${nationalityFlag(player.player_nationality)}`.trim()
    : NO_VALUE;
  // Every season this player appears in the data, not a full MLS career -- the data
  // only reaches back to MIN_SEASON. Empty until the dialog's history fetch lands.
  const seasonYears = seasonRows.map((row) => Number(row.season));
  const seasons = seasonYears.length
    ? `${seasonYears.length} (${Math.min(...seasonYears)}–${Math.max(...seasonYears)})`
    : NO_VALUE;
  const hasNineties = player.nineties > 0;

  const facts = [
    { label: "Squad", value: player.squad || NO_VALUE },
    { label: "Nationality", value: nationality },
    { label: "Born", value: born },
    {
      label: "Seasons",
      value: seasons,
      tooltip: `Seasons this player appears in our data, which covers ${MIN_SEASON}–${MAX_SEASON}`,
    },
    { label: `90s in ${season}`, value: player.nineties ?? NO_VALUE },
    {
      label: "Turnovers Won",
      value: hasNineties ? turnoversWon(player) : NO_VALUE,
      tooltip: "Tackles won, aerial duels won and interceptions",
    },
    {
      label: "Turnovers Won / 90",
      value: hasNineties ? turnoversWonPer90(player).toFixed(1) : NO_VALUE,
    },
    { label: "Salary", value: formatSalary(player.guaranteed_comp) },
    {
      label: "SMETZ/$M",
      value: formatValueMetric(player.schmetzer_score_per_million),
    },
  ];

  // Plain body type, matching the "Squad • Position" line under the player's name.
  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      {facts.map(({ label, value, tooltip }) => {
        const labelText = (
          <Box
            component="span"
            fontWeight="bold"
            sx={tooltip ? { cursor: "help" } : undefined}
          >
            {label}:
          </Box>
        );
        return (
          <Typography key={label} lineHeight={1.4}>
            {tooltip ? (
              <Tooltip
                title={tooltip}
                arrow
                placement="top"
                slotProps={getMuiChartTooltipSlotProps(theme)}
              >
                {labelText}
              </Tooltip>
            ) : (
              labelText
            )}{" "}
            {value}
          </Typography>
        );
      })}
    </Box>
  );
}
