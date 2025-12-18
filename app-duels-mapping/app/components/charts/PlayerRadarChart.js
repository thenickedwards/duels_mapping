"use client";

import { Box, useTheme, Typography } from "@mui/material";
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

  const baseColor = theme.palette.mode === "dark" ? "#B7F08E" : "#3B5B84";

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
          Chart Label
        </Typography>
      </Box>

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
                font: {
                  family: "'Bebas Neue', sans-serif",
                  size: 16,
                  weight: "400",
                },
                color: theme.palette.mode === "dark" ? "white" : "black",
                padding: 8,
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
