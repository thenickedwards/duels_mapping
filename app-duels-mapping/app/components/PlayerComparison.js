"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(ArcElement, Tooltip, Legend);

const fetcher = (url) => fetch(url).then((res) => res.json());
const currentYear = new Date().getFullYear();
const statLabels = [
  "schmetzer_rk",
  "interceptions",
  "tackles_won",
  "recoveries",
  "aerial_duels_won",
  "aerial_duels_total",
];

export default function PlayerComparison() {
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);

  const { data: players, isLoading } = useSWR(
    `/api/schmetzer_scores?season=${currentYear}`,
    fetcher
  );

  const playerOptions = useMemo(() => players || [], [players]);

  const getPlayerStats = (playerName) =>
    playerOptions?.find((p) => p.player_name === playerName);

  const renderDonutChart = (stat) => {
    const statA = playerA ? playerA[stat] : 0;
    const statB = playerB ? playerB[stat] : 0;

    const data = {
      labels: ["Player A", "Player B"],
      datasets: [
        {
          data: [statA, statB],
          backgroundColor: ["#d32f2f", "#1976d2"],
          borderWidth: 2,
        },
      ],
    };

    const plugins = [
      {
        id: "customLabels",
        beforeDraw: (chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();
          const fontSize = 14;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";

          ctx.fillStyle = "#d32f2f";
          ctx.fillText(statA, width / 2, height / 2 - 10);

          ctx.fillStyle = "#1976d2";
          ctx.fillText(statB, width / 2, height / 2 + 10);

          ctx.save();
        },
      },
    ];

    return (
      <Box key={stat} sx={{ textAlign: "center", width: 160 }}>
        <Doughnut data={data} options={{ cutout: "70%" }} plugins={plugins} />
        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>
          {stat.replace(/_/g, " ").toUpperCase()}
        </Typography>
      </Box>
    );
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return (
      parts[0][0].toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "")
    );
  };

  const renderPlayerDetails = (player, side) => {
    if (!player) return null;
    const hasImage = !!player.player_image;
    return (
      <Box textAlign="center">
        <Avatar
          src={hasImage ? player.player_image : undefined}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            border: `3px solid ${side === "left" ? "#d32f2f" : "#1976d2"}`,
            bgcolor: hasImage ? "transparent" : "black",
            color: hasImage ? "inherit" : "white",
            fontSize: "1.25rem",
          }}
        >
          {!hasImage && getInitials(player.player_name)}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            borderBottom: `2px solid ${
              side === "left" ? "#d32f2f" : "#1976d2"
            }`,
            display: "inline-block",
          }}
        >
          {player.player_name}
        </Typography>
      </Box>
    );
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Autocomplete
            options={playerOptions.map((p) => p.player_name)}
            value={playerA?.player_name || ""}
            onChange={(_, newValue) => setPlayerA(getPlayerStats(newValue))}
            renderInput={(params) => (
              <TextField {...params} label="Player A" variant="outlined" />
            )}
          />
          {renderPlayerDetails(playerA, "left")}
        </Grid>

        <Grid item xs={12} md={2} textAlign="center">
          <Typography variant="h5" sx={{ mt: 6 }}>
            VS
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Autocomplete
            options={playerOptions.map((p) => p.player_name)}
            value={playerB?.player_name || ""}
            onChange={(_, newValue) => setPlayerB(getPlayerStats(newValue))}
            renderInput={(params) => (
              <TextField {...params} label="Player B" variant="outlined" />
            )}
          />
          {renderPlayerDetails(playerB, "right")}
        </Grid>
      </Grid>

      {playerA && playerB && (
        <Grid container spacing={3} justifyContent="center" mt={4}>
          {statLabels.map((stat) => (
            <Grid item xs={6} md={4} key={stat}>
              {renderDonutChart(stat)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
