"use client";

import { useMemo } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { baseChartTooltipOptions } from "./styles/chartTooltipOptions";
import { ROUND_CHART_HEIGHT, ROUND_CHART_RADIUS } from "./styles/roundChartSize";
import { MIN_NINETIES_FOR_AVERAGES } from "@/utils/request-context";

ChartJS.register(ArcElement, Tooltip, Legend);

/*
Turnovers won per 90: tackles won, aerial duels won and interceptions.

The ring shows the player's mix (how they win the ball); the centre shows the volume
against the league's pooled per-90 rate over the floored season field
(avg(stat) / avg(nineties) == total actions / total 90s).

Recoveries are left out on purpose: at ~3.8 of the league's ~6.5 per 90 they swamped
the other three and hid the challenge-vs-read split. An aerial duel won is not always
possession won (a headed clearance can land with the opponent) -- it is counted here as
the player winning the ball, not as a guaranteed change of possession.
*/

const SEGMENTS = [
  { key: "tackles_won", avgKey: "tkw_avg", label: "TKW", name: "Tackles Won" },
  { key: "aerial_duels_won", avgKey: "adw_avg", label: "ADW", name: "Aerial Duels Won" },
  { key: "interceptions", avgKey: "int_avg", label: "INT", name: "Interceptions" },
];

// Clockwise from 12 o'clock the ring runs ADW, INT, TKW; the legend keeps SEGMENTS order.
const RING_ORDER = ["aerial_duels_won", "interceptions", "tackles_won"];

const per90 = (value, nineties) => (nineties > 0 ? (value ?? 0) / nineties : 0);

function createDiagonalPattern(color, background) {
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size, 0);
  ctx.stroke();
  return ctx.createPattern(canvas, "repeat");
}

export default function BallWinningDonutChart({ player, seasonStats }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Brand hue plus a second step of it for the two duels; interceptions -- won by
  // reading the play rather than a challenge -- are hatched in the brand hue.
  const primary = isDark ? theme.palette.common.limegreen : theme.palette.common.blue;
  const secondary = isDark ? "#5E8A45" : "#7391B8";
  const surface = isDark ? "#303034" : "#FAFAFA";
  const textColor = isDark ? theme.palette.common.white : theme.palette.common.black;
  const muted = isDark ? alpha(theme.palette.common.white, 0.65) : "#666666";

  const hatch = useMemo(() => {
    if (typeof window === "undefined") return "transparent";
    return createDiagonalPattern(primary, alpha(primary, 0.18));
  }, [primary]);

  const nineties = player?.nineties ?? 0;
  const leagueNineties = seasonStats?.nineties_avg ?? 0;

  const fills = { tackles_won: primary, aerial_duels_won: secondary, interceptions: hatch };

  const rows = SEGMENTS.map((segment) => ({
    ...segment,
    fill: fills[segment.key],
    total: player?.[segment.key] ?? 0,
    value: per90(player?.[segment.key], nineties),
    league: per90(seasonStats?.[segment.avgKey], leagueNineties),
  }));

  const playerTotal = rows.reduce((sum, row) => sum + row.value, 0);
  const leagueTotal = rows.reduce((sum, row) => sum + row.league, 0);

  const ringRows = RING_ORDER.map((key) => rows.find((row) => row.key === key));
  const legendPosition = (ringIndex) => rows.indexOf(ringRows[ringIndex]);

  // Diff taken between the rounded figures shown, so e.g. 4.5 vs 2.7 always reads +1.8
  const shownPlayer = Number(playerTotal.toFixed(1));
  const shownLeague = Number(leagueTotal.toFixed(1));
  const delta = Number((shownPlayer - shownLeague).toFixed(1));
  const leagueComparison = {
    delta: delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1),
    symbol: delta > 0 ? ">" : delta < 0 ? "<" : "=",
    league: shownLeague.toFixed(1),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography
        variant="subtitle1"
        component={"div"}
        sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
      >
        Turnovers Won / 90
      </Typography>

      {nineties > 0 ? (
        <Box sx={{ height: ROUND_CHART_HEIGHT, position: "relative" }}>
          <Doughnut
            data={{
              labels: ringRows.map((row) => `${row.label} ${row.value.toFixed(2)}`),
              datasets: [
                {
                  label: player.player_name,
                  data: ringRows.map((row) => row.value),
                  backgroundColor: ringRows.map((row) => row.fill),
                  hoverBackgroundColor: ringRows.map((row) => row.fill),
                  // Surface-coloured borders are the gaps between segments
                  borderColor: surface,
                  hoverBorderColor: surface,
                  borderWidth: 3,
                  radius: ROUND_CHART_RADIUS,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "68%",
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    color: textColor,
                    font: { family: "'Nunito Sans', sans-serif", size: 12 },
                    padding: 16,
                    boxWidth: 14,
                    sort: (a, b) => legendPosition(a.index) - legendPosition(b.index),
                  },
                },
                tooltip: {
                  ...baseChartTooltipOptions(theme),
                  callbacks: {
                    title: (items) => ringRows[items[0].dataIndex].name,
                    label: (item) => {
                      const row = ringRows[item.dataIndex];
                      return [
                        `${row.value.toFixed(2)} / 90 (${row.total} total)`,
                        `League: ${row.league.toFixed(2)} / 90`,
                      ];
                    },
                  },
                },
              },
            }}
          />

          {/* Centre label, lifted above the legend so it sits in the ring's hole */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "calc(50% - 18px)",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.5rem",
                lineHeight: 1,
                color: primary,
              }}
            >
              {playerTotal.toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: muted, lineHeight: 1.2 }}>
              per 90
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ color: muted, fontSize: "0.875rem", mt: 1 }}>
          No minutes recorded this season.
        </Typography>
      )}

      {nineties > 0 && leagueTotal > 0 && (
        <Typography
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.8rem",
            textAlign: "center",
            color: textColor,
            mt: 1,
          }}
        >
          <Box component="span" sx={{ fontWeight: 700 }}>
            {leagueComparison.delta}
          </Box>{" "}
          {leagueComparison.symbol} Lg avg {leagueComparison.league}
        </Typography>
      )}

      {nineties > 0 && nineties < MIN_NINETIES_FOR_AVERAGES && (
        <Typography sx={{ color: muted, fontSize: "0.7rem", mt: 1 }}>
          Small sample: {nineties} 90s played.
        </Typography>
      )}
    </Box>
  );
}
