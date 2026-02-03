"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { getMuiChartTooltipSlotProps } from "./styles/chartTooltipOptions";

export default function PlayerMetricsBarChart({ metrics = {}, averages = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const labels = ["ADW", "ADL", "TKW", "INT", "RECOV"];

  const dataValues = labels.map((label) => metrics[label] ?? 0);
  const averageValues = labels.map((label) => averages[label] ?? 0);

   const tooltipSlotProps = getMuiChartTooltipSlotProps(theme);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="subtitle1"
          component={"div"}
          sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
        >
          Chart Label
        </Typography>
      </Box>

      {labels.map((label, index) => {
        const isLast = index === labels.length - 1;
        const value = dataValues[index];
        const average = averageValues[index];
        const allValues = [...dataValues, ...averageValues];
        const max = Math.max(...allValues, 1);

        const percent = (value / max) * 100;
        const avgPos = (average / max) * 100;

        return (
          <Box
            key={label}
            mb={isLast ? 0 : 2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                minWidth: 40,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1rem",
              }}
            >
              {label}
            </Typography>
            <Box
              sx={{
                flex: 1,
                mx: 1,
                display: "flex",
                alignItems: "center",
                height: 20,
                position: "relative",
              }}
            >
              {/* Filled bar */}
              <Tooltip title={`Value: ${value}`} arrow slotProps={tooltipSlotProps}>
                <Box
                  sx={{
                    height: 16,
                    width: `${percent}%`,
                    background: isDark
                      ? "linear-gradient(to right, #3B5B84, #B7F08E)"
                      : theme.palette.common.blue,
                    borderRadius: 4,
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>

              {/* Bar background */}
              <Box
                sx={{
                  height: 16,
                  width: "100%",
                  border: isDark ? "1px solid #646464" : `1px solid ${theme.palette.common.blue}`,
                  backgroundColor: isDark ? "#646464" : theme.palette.common.white,
                  borderRadius: 4,
                  zIndex: 0,
                  cursor: "default",
                }}
              />

              {/* Average dot */}
              <Tooltip title={`Avg: ${average}`} arrow slotProps={tooltipSlotProps}>
                <Box
                  sx={{
                    position: "absolute",
                    left: `${avgPos}%`,
                    transform: "translate(-50%, 0)",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: isDark ? `1px solid ${theme.palette.common.white}` : "1px solid #3B5B84",
                    backgroundColor: isDark ? theme.palette.common.white : theme.palette.common.limegreen,
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
            <Typography
              sx={{
                minWidth: 24,
                textAlign: "right",
                fontFamily: "Nunito Sans, sans-serif",
                fontSize: "0.75rem",
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
