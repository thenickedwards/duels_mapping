"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { getMuiChartTooltipSlotProps } from "./styles/chartTooltipOptions";

const CHART_HEIGHT = 220;
const BAR_WIDTH = 32;

export default function PlayerMetricsVerticalBarChart({
  metrics = {},
  averages = {},
  maxes = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const labels = ["ADW", "ADL", "TKW", "INT", "RECOV"];

  const dataValues = labels.map((label) => metrics[label] ?? 0);
  const averageValues = labels.map((label) => Math.round(averages[label] ?? 0));
  const maxValues = labels.map((label) => maxes[label] ?? 0);

  const tooltipSlotProps = getMuiChartTooltipSlotProps(theme);

  // Colors — matches the palette used by PlayerMetricsLineChart so the
  // player/avg/max meaning stays consistent across iterations.
  const playerColor = isDark ? theme.palette.common.limegreen : theme.palette.common.blue;
  const maxColor = isDark ? theme.palette.common.blue : theme.palette.common.limegreen;
  const avgColor = isDark ? theme.palette.common.white : theme.palette.common.black;

  // Shared scale across all five stats, same as the line chart's single
  // y-axis, so the columns stay comparable to one another.
  const domainMax = Math.max(...maxValues, ...dataValues, 1);

  const gridLines = [0.25, 0.5, 0.75, 1];
  const axisColor = isDark ? "#555" : "#ccc";

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
        >
          Player vs MLS
        </Typography>
      </Box>

      {/* Plot area — fixed height, holds only gridlines + bars so the
          axis/labels below always sit reliably outside of it. */}
      <Box
        sx={{
          position: "relative",
          height: CHART_HEIGHT,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {/* Gridlines */}
        {gridLines.map((fraction) => (
          <Box
            key={fraction}
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `${fraction * 100}%`,
              borderTop: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
            }}
          />
        ))}

        {labels.map((label, index) => {
          const value = dataValues[index];
          const average = averageValues[index];
          const max = maxValues[index];

          const maxPct = (max / domainMax) * 100;
          const valuePct = (value / domainMax) * 100;
          const avgPct = (average / domainMax) * 100;

          return (
            <Box
              key={label}
              sx={{
                position: "relative",
                zIndex: 1,
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: BAR_WIDTH,
                  height: "100%",
                }}
              >
                {/* Max bar — inflated behind the player's bar, hidden once
                    the player matches/exceeds it since both sit at the
                    same baseline and share the same width. */}
                <Tooltip title={`Max: ${max}`} arrow slotProps={tooltipSlotProps}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      height: `${maxPct}%`,
                      backgroundImage: `repeating-linear-gradient(-45deg, ${maxColor} 0, ${maxColor} 1px, transparent 0, transparent 50%)`,
                      backgroundSize: "6px 6px",
                      border: `1px solid ${maxColor}`,
                      borderBottom: "none",
                      borderRadius: "3px 3px 0 0",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>

                {/* Average — dashed line scoped to this stat's own bar */}
                <Tooltip title={`Avg: ${average}`} arrow slotProps={tooltipSlotProps}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -6,
                      right: -6,
                      bottom: `${avgPct}%`,
                      borderTop: `1.5px dashed ${avgColor}`,
                      zIndex: 3,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>

                {/* Player bar — same width as the max bar, stacked directly
                    on top of it so the two read as one bar. */}
                <Tooltip title={`Player: ${value}`} arrow slotProps={tooltipSlotProps}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      height: `${valuePct}%`,
                      backgroundColor: playerColor,
                      borderRadius: "3px 3px 0 0",
                      zIndex: 2,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* X-axis — always directly below the plot area, above the labels */}
      <Box sx={{ borderTop: `1.5px solid ${axisColor}` }} />

      {/* Stat labels — rendered in normal flow beneath the axis, using the
          same column widths as the plot area above so they stay aligned. */}
      <Box display="flex" justifyContent="space-between" mt={1}>
        {labels.map((label) => (
          <Box key={label} sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.9rem",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box display="flex" gap={3} mt={1.5} justifyContent="center">
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 24,
              height: 0,
              borderBottom: `1.5px dashed ${avgColor}`,
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.8rem",
              color: theme.palette.text.primary,
            }}
          >
            Avg
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 16,
              height: 12,
              backgroundImage: `repeating-linear-gradient(-45deg, ${maxColor} 0, ${maxColor} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "6px 6px",
              border: `1px solid ${maxColor}`,
              borderRadius: "2px",
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.8rem",
              color: theme.palette.text.primary,
            }}
          >
            Max
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 16,
              height: 12,
              backgroundColor: playerColor,
              borderRadius: "2px",
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.8rem",
              color: theme.palette.text.primary,
            }}
          >
            Player
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
