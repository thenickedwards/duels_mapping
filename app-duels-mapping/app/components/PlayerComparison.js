"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Container,
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
import { inputStyle } from "../styles/inputStyles";
import CustomAutocomplete from "./CustomAutocomplete";

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
  const theme = useTheme();

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
    const leftColor = theme.palette.mode === "dark" ? "#B7F08E" : "#A1D17E";
    const rightColor = theme.palette.mode === "dark" ? "#ffffff" : "#3B5B84";  

    const data = {
      labels: ["Player A", "Player B"],
      datasets: [
        {
          data: [statA, statB],
          backgroundColor: [leftColor, rightColor],
          borderColor: "transparent",
          borderWidth: 4,
        },
      ],
    };

    const options = {
      cutout: "88%",
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const value = context.formattedValue;
              return `  ${value}`;
            },
          },
        },
      },
    };

    const plugins = [
      {
        id: "customLabels",
        beforeDraw: (chart) => {
          const { chartArea, ctx } = chart;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;
          const leftColor = theme.palette.mode === "dark" ? "#B7F08E" : "#A1D17E";
          const rightColor = theme.palette.mode === "dark" ? "#ffffff" : "#3B5B84";
        

          ctx.save();
          ctx.font = "2.5rem  'Bebas Neue', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Player A value on top
          ctx.fillStyle = leftColor;
          ctx.fillText(statA, centerX, centerY - 20);

          // Player B value on bottom
          ctx.fillStyle = rightColor;
          ctx.fillText(statB, centerX, centerY + 22);

          ctx.restore();
        },
      },
    ];

    return (
      <Box key={stat} sx={{ textAlign: "center", width: 160 }}>
        <Doughnut key={theme.palette.mode} data={data} options={options} plugins={plugins} />
        <Typography variant="h4" sx={{ mt: 1, fontSize: "1.2rem" }}>
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
            width: 100,
            height: 100,
            mx: "auto",
            border: "1px solid #000",
            bgcolor: hasImage ? "transparent" : "black",
            color: hasImage ? "inherit" : "white",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2rem",
          }}
        >
          {!hasImage && getInitials(player.player_name)}
        </Avatar>
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            borderBottom: `4px solid ${
              theme.palette.mode === "dark"
                ? side === "left"
                  ? "#B7F08E"
                  : "#ffffff"
                : side === "left"
                ? "#A1D17E"
                : "#3B5B84"
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
    <Container maxWidth="md">
    <Box sx={{ py: 3 }}>
      <Grid container justifyContent={"center"} mb={"80px"}>
        <Grid item size={{ xs: 12, md: 10 }}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        <Grid item size={{ xs: 12, md: 5 }}>
          <CustomAutocomplete
            label="Player A"
            placeholder="Select Player"
            options={playerOptions.map((p) => p.player_name)}
            value={playerA?.player_name || ""}
            onChange={(_, newValue) => setPlayerA(getPlayerStats(newValue))}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 5}}>
          <CustomAutocomplete
            label="Player A"
            placeholder="Select Player"
            options={playerOptions.map((p) => p.player_name)}
            value={playerB?.player_name || ""}
            onChange={(_, newValue) => setPlayerB(getPlayerStats(newValue))}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} justifyContent="center">
        <Grid item size={{ xs: 5, md: 3 }}>
          {renderPlayerDetails(playerA, "left")}
        </Grid>

        {playerA && playerB && (
          <Grid item size={{ xs: 2, md: 3 }} textAlign="center">
            <Typography
              fontFamily={"'Bebas Neue', sans-serif"}
              fontSize={"2.5rem"}
              sx={{ mt: 6 }}
            >
              VS
            </Typography>
          </Grid>
        )}

        <Grid item size={{ xs: 5, md: 3 }}>
          {renderPlayerDetails(playerB, "right")}
        </Grid>
      </Grid>

      {playerA && playerB && (
        <Grid container spacing={3} justifyContent="center" mt={8}>
          {statLabels.map((stat) => (
            <Grid item size={{ xs: 6, md: 4 }} key={stat} p={2}>
              <Box display={"flex"} justifyContent={"center"}>
                {renderDonutChart(stat)}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
   </Container>
  );
 
}
