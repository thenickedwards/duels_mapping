"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CustomAutocomplete from "../inputs/CustomAutocomplete";
import { baseButtonStyle } from "../../styles/buttonStyles";
import FilterChip from "../../styles/FilterChip";
import PlayerAvatar from "../players/PlayerAvatar";
import LastUpdated from "../common/LastUpdated";
import PlayerYearControls from "../players/PlayerYearControls";

ChartJS.register(ArcElement, Tooltip, Legend);

const fetcher = (url) => fetch(url).then((res) => res.json());
const statLabels = [
  "aerial_duels_won",
  "aerial_duels_lost",
  "aerial_duels_won_pct",
  "interceptions",
  "tackles_won",
  "recoveries",
];

export default function PlayerComparison({
  currentYear,
  selectedYear,
  updateSeason,
  players,
}) {
  const theme = useTheme();

  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);

  const [dropdownYear, setDropdownYear] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const playerOptions = useMemo(
    () => (Array.isArray(players) ? players : []),
    [players]
  );

  const getPlayerStats = (playerName) =>
    playerOptions?.find((p) => p.player_name === playerName);

  const playerNames = useMemo(
    () => playerOptions.map((p) => p.player_name),
    [playerOptions]
  );

  const disabledForA = useMemo(
    () => (playerB?.player_name ? [playerB.player_name] : []),
    [playerB]
  );

  const disabledForB = useMemo(
    () => (playerA?.player_name ? [playerA.player_name] : []),
    [playerA]
  );

  const centerValuesPlugin = {
    id: "centerValues",
    beforeDraw(chart, _args, _pluginOptions) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      // Always read the latest values from the dataset
      const ds = chart.config.data?.datasets?.[0];
      const [rawB = 0, rawA = 0] = Array.isArray(ds?.data) ? ds.data : [0, 0];

      const statA = Number(rawA) || 0;
      const statB = Number(rawB) || 0;

      const rightColor = Array.isArray(ds?.backgroundColor)
        ? ds.backgroundColor[0] // Player B
        : blue;
      const leftColor = Array.isArray(ds?.backgroundColor)
        ? ds.backgroundColor[1] // Player A
        : limegreen;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "36px 'Bebas Neue', sans-serif";

      ctx.fillStyle = leftColor;
      ctx.fillText(statA, centerX, centerY - 20);

      ctx.fillStyle = rightColor;
      ctx.fillText(statB, centerX, centerY + 22);

      ctx.restore();
    },
  };

  const renderDonutChart = (stat) => {
    const statA = playerA ? Number(playerA[stat]) || 0 : 0;
    const statB = playerB ? Number(playerB[stat]) || 0 : 0;

    const leftColor = theme.palette.mode === "dark" ? theme.palette.common.limegreen : "#A1D17E";
    const rightColor = theme.palette.mode === "dark" ? white : blue;

    const data = {
      labels: ["Player B", "Player A"],

      datasets: [
        {
          data: [statB, statA],
          backgroundColor: [rightColor, leftColor],
          borderColor: "transparent",
          borderWidth: 4,
        },
      ],
    };

    const options = {
      cutout: "88%",
      animation: { duration: 300 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            // Fix tooltip labels so they match Player A/B meaning
            label: (ctx) => {
              if (ctx.dataIndex === 0) {
                return ` ${statB}`; // Player B
              }
              return ` ${statA}`; // Player A
            },
          },
        },
      },
      maintainAspectRatio: false,
    };

    return (
      <Box key={stat} sx={{ textAlign: "center", width: 160, height: 160 }}>
        <Doughnut
          // Force a re-render when the players or stat change
          key={`${stat}-${playerA?.player_name ?? "na"}-${
            playerB?.player_name ?? "nb"
          }-${theme.palette.mode}`}
          data={data}
          options={options}
          plugins={[centerValuesPlugin]}
          redraw
        />
        <Typography variant="h4" sx={{ mt: 1, fontSize: "1.2rem" }}>
          {stat.replace(/_/g, " ").toUpperCase()}
        </Typography>
      </Box>
    );
  };

  // Open/close dropdown menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleButtonYearClick = (year) => {
    setDropdownYear(null); // no chip
    setPlayerA(null);
    setPlayerB(null);
    updateSeason(year); // <-- update URL
  };

  const handleDropdownYearSelect = (year) => {
    setDropdownYear(year); // show chip
    setAnchorEl(null);
    setPlayerA(null);
    setPlayerB(null);
    updateSeason(year); // <-- update URL
  };

  const handleClearChip = () => {
    setDropdownYear(null);
    setPlayerA(null);
    setPlayerB(null);
    updateSeason(currentYear); // <-- reset URL
  };

  const black = theme.palette.common.black;
  const white = theme.palette.common.white;
  const limegreen = theme.palette.common.limegreen;
  const blue = theme.palette.common.blue;

  // Dropdown years (2018-2023)
  const previousYears = [2023, 2022, 2021, 2020, 2019, 2018];

  return (
    <Box
      sx={{
        minHeight: "76vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="md" sx={{ flex: 1, pb: "60px" }}>
        <Box sx={{ py: 3 }}>
          <Grid container justifyContent={"center"} mb={"24px"}>
            <Grid
              item
              justifyContent={"center"}
              mb={"20px"}
              size={{ xs: 12, md: 10 }}
            >
              <Typography variant="body1">
                The `Comparisons` tool of Duels Mapping allows you to explore
                1v1 player match-ups which can be leveraged by coaching staff
                for strategizing in-game tactics, performance analysis, and
                scouting/recruitment opportunities.
              </Typography>
            </Grid>
          </Grid>

          {/* Season Buttons */}
          {/* Year Selector */}
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            mb={8}
          >
            <Grid
              item
              size={{ xs: 12, md: 10 }}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {dropdownYear && (
                  <FilterChip label={dropdownYear} onRemove={handleClearChip} />
                )}
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <PlayerYearControls
                    selectedYear={selectedYear}
                    updateSeason={(year) => {
                      // reset players any time year changes (same as your current logic)
                      setPlayerA(null);
                      setPlayerB(null);
                      updateSeason(year);
                    }}
                    baseButtonStyle={baseButtonStyle}
                    hardcodedYears={[2025, 2024]}
                    dropdownYears={previousYears}
                    onDropdownSelect={(yearOrNull) => {
                      // chip only for dropdown years, clear for hardcoded
                      setDropdownYear(yearOrNull);
                    }}
                  />

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: "10px",
                        ml: "-8px",
                        maxHeight: 300,
                        width: 100,
                        borderRadius: 0,
                        boxShadow: "none",
                        backgroundColor:
                          theme.palette.mode === "dark" ? black : white,
                        border: `1px solid ${
                          theme.palette.mode === "dark" ? white : black
                        }`,
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    {previousYears.map((year) => (
                      <MenuItem
                        key={year}
                        onClick={() => handleDropdownYearSelect(year)}
                        sx={{
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={4} justifyContent="center">
            <Grid item size={{ xs: 12, md: 5 }}>
              <CustomAutocomplete
                label="Player A"
                placeholder="Select Player"
                options={playerNames}
                disabledOptions={disabledForA}
                value={playerA?.player_name || ""}
                onChange={(_, newValue) => setPlayerA(getPlayerStats(newValue))}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 5 }}>
              <CustomAutocomplete
                label="Player B"
                placeholder="Select Player"
                options={playerNames}
                disabledOptions={disabledForB}
                value={playerB?.player_name || ""}
                onChange={(_, newValue) => setPlayerB(getPlayerStats(newValue))}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} justifyContent="center">
            <Grid item size={{ xs: 5, md: 3 }}>
              <PlayerAvatar player={playerA} side="left" />
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
              <PlayerAvatar player={playerB} side="right" />
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
      <Box sx={{ mt: "auto" }}>
        <LastUpdated />
      </Box>
    </Box>
  );
}
