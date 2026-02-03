"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip as ChartTooltip,
} from "chart.js";
import { getMuiChartTooltipSlotProps } from "./styles/chartTooltipOptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ChartTooltip
);

export default function SchmetzerScoreBar({
  value,
  average = 150,
  darkMode = false,
}) {
  const theme = useTheme();

  const max = 300;
  const percentage = (value / max) * 100;
  const avgPosition = (average / max) * 100;

  const background = darkMode
    ? `linear-gradient(
      to right,
      ${theme.palette.common.blue},
      ${theme.palette.common.limegreen}
    )`
    : theme.palette.common.blue;

  const tooltipSlotProps = getMuiChartTooltipSlotProps(theme);

  return (
    <Box>
      <Typography variant="h2" component="div" fontSize="1.6rem">
        Schmetzer Score
      </Typography>

      <Typography
        fontFamily="'Bebas Neue', sans-serif"
        textAlign="left"
        fontSize="6rem"
        fontWeight="bold"
        mb={1}
        mt="-12px"
      >
        {value}
      </Typography>

      <Box sx={{ height: 16, position: "relative" }}>
        {/* Player score bar + tooltip */}
        <Tooltip title={`Score: ${value}`} arrow slotProps={tooltipSlotProps}>
          <Box
            sx={{
              width: `${percentage}%`,
              height: 16,
              background,
              borderRadius: 4,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              cursor: "pointer",
            }}
          />
        </Tooltip>

        {/* Bar background (non-interactive) */}
        <Box
          sx={{
            width: "100%",
            height: 16,
            border: darkMode ? "1px solid #646464" : "1px solid #3B5B84",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 4,
            backgroundColor: darkMode ? "#646464" : theme.palette.common.white,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Average dot + its own tooltip */}
        <Tooltip
          title={`League Avg: ${average}`}
          arrow
          slotProps={tooltipSlotProps}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: `${avgPosition}%`,
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: darkMode
                ? `1px solid ${theme.palette.common.white}`
                : "1px solid #3B5B84",
              backgroundColor: darkMode
                ? theme.palette.common.white
                : theme.palette.common.limegreen,
              zIndex: 2,
              cursor: "pointer",
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}
