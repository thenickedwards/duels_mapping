"use client";

import { Box, useTheme, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { baseChartTooltipOptions } from "./styles/chartTooltipOptions";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PlayerPolarChart({ player }) {
  const theme = useTheme();
  const labels = ["ADW", "TKW", "INT", "RECOV", "ADW%"];
  const data = [
    player.aerial_duels_won ?? 0,
    player.tackles_won ?? 0,
    player.interceptions ?? 0,
    player.recoveries ?? 0,
    player.aerial_duels_won_pct ?? 0,
  ];

  const baseColor =
    theme.palette.mode === "dark"
      ? theme.palette.common.limegreen
      : theme.palette.common.blue;
  const bgColor =
    theme.palette.mode === "dark"
      ? "rgba(183, 240, 142, 0.4)"
      : "rgba(59, 91, 132, 0.4)";

  return (
    <Box>
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
          Player Stats
        </Typography>
      </Box>

      <PolarArea
        data={{
          labels,
          datasets: [
            {
              label: player.player_name,
              data,
              backgroundColor: Array(5).fill(bgColor),
              borderColor: Array(5).fill(baseColor),
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          interaction: {
            mode: "nearest",
            intersect: true,
          },
          onHover: (event, elements) => {
            const canvas = event?.native?.target;
            if (!canvas) return;
            canvas.style.cursor = elements?.length ? "pointer" : "default";
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                display: true,
                stepSize: 25,
                font: {
                  family: "'Nunito Sans', sans-serif",
                  size: 10,
                },
                color: theme.palette.mode === "dark" ? "#888" : "#aaa",
                backdropColor: "transparent",
              },
              pointLabels: {
                display: true,
                centerPointLabels: true,
                font: {
                  family: "'Bebas Neue', sans-serif",
                  size: 16,
                  weight: "400",
                },
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                padding: 8,
              },
              grid: {
                color: theme.palette.mode === "dark" ? "#888" : "#ccc",
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: baseChartTooltipOptions(theme),
          },
        }}
      />
    </Box>
  );
}
