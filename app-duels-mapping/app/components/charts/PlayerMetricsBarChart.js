"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";

export default function PlayerMetricsBarChart({ metrics = {}, averages = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const labels = ["INT", "TKW", "RECOV", "ADW", "ADL"];

  const dataValues = labels.map((label) => metrics[label] ?? 0);
  const averageValues = labels.map((label) => averages[label] ?? 0);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", 
      height: "100%", 
    }}>
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
              <Tooltip title={`Value: ${value}`} arrow>
                <Box
                  sx={{
                    height: 16,
                    width: `${percent}%`,
                    background: isDark
                      ? "linear-gradient(to right, #3B5B84, #B7F08E)"
                      : "#3B5B84",
                    borderRadius: 4,
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                  }}
                />
              </Tooltip>

              {/* Bar background */}
              <Box
                sx={{
                  height: 16,
                  width: "100%",
                  border: isDark ? "1px solid #646464" : "1px solid #3B5B84",
                  backgroundColor: isDark ? "#646464" : "white",
                  borderRadius: 4,
                  zIndex: 0,
                }}
              />

              {/* Average dot */}
              <Tooltip title={`Avg: ${average}`} arrow>
                <Box
                  sx={{
                    position: "absolute",
                    left: `${avgPos}%`,
                    transform: "translate(-50%, 0)",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: isDark ? "1px solid #fff" : "1px solid #3B5B84",
                    backgroundColor: isDark ? "#fff" : "#B7F08E",
                    zIndex: 2,
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
