"use client";

import { useMemo } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { baseChartTooltipOptions } from "./styles/chartTooltipOptions";

ChartJS.register(ArcElement, Tooltip, Legend);

function createDiagonalPattern(color) {
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size, 0);
  ctx.stroke();
  return ctx.createPattern(canvas, "repeat");
}

export default function PlayerDuelsPieChart({ player }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ADL is slice 0 (sweeps right), ADW is slice 1 (lands on left) with rotation Math.PI/2
  const labels = ["ADL", "ADW"];
  const data = [player.aerial_duels_lost ?? 0, player.aerial_duels_won ?? 0];

  const adwColor = isDark
    ? theme.palette.common.limegreen
    : theme.palette.common.blue;
  const adwBgColor = isDark
    ? "rgba(183, 240, 142, 0.4)"
    : "rgba(59, 91, 132, 0.4)";

  const adlColor = isDark ? theme.palette.common.blue : "#888888";

  const adlBgColor = useMemo(() => {
    if (typeof window === "undefined") return "transparent";
    return isDark ? "rgba(59, 91, 132, 0.4)" : createDiagonalPattern("#888888");
  }, [isDark]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={0}
      >
        <Typography
          variant="subtitle1"
          component={"div"}
          sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
        >
          Aerial Duels Won vs Lost
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              label: player.player_name,
              data,
              backgroundColor: [adlBgColor, adwBgColor],
              borderColor: [adlColor, adwColor],
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          rotation: Math.PI / 2,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              reverse: true,
              labels: {
                color: isDark
                  ? theme.palette.common.white
                  : theme.palette.common.black,
                font: {
                  family: "'Nunito Sans', sans-serif",
                  size: 12,
                },
                padding: 16,
              },
            },
            tooltip: baseChartTooltipOptions(theme),
          },
        }}
      />
      </Box>
    </Box>
  );
}
