"use client";

import { Box, useTheme } from "@mui/material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function PlayerRadarChart({ player }) {
  const theme = useTheme();
  const labels = ["ADW", "TKW", "INT", "RECOV", "ADW%"];
  const data = [
    player.aerial_duels_won ?? 0,
    player.tackles_won ?? 0,
    player.interceptions ?? 0,
    player.recoveries ?? 0,
    player.aerial_duels_won_pct ?? 0,
  ];

  const baseColor = theme.palette.mode === "dark" ? "#B7F08E" : "#1976d2";

  return (
    <Box>
      <Radar
        data={{
          labels,
          datasets: [
            {
              label: player.player_name,
              data,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(183, 240, 142, 0.2)"
                  : "rgba(25, 118, 210, 0.2)",
              borderColor: baseColor,
              pointBackgroundColor: baseColor,
            },
          ],
        }}
        options={{
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: { display: false },
              pointLabels: {
                font: { size: 12 },
              },
              grid: {
                color: theme.palette.mode === "dark" ? "#888" : "#ccc",
              },
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </Box>
  );
}
