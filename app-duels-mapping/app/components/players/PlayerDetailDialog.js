"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Avatar,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { getInitials } from "@/utils/getInitials";
import SchmetzerScoreBar from "../charts/SchmetzerScoreBar";
import PlayerMetricsVerticalBarChart from "../charts/PlayerMetricsVerticalBarChart";
import PlayerDuelsPieChart from "../charts/PlayerDuelsPieChart";
import SchmetzerTrendChart from "../charts/SchmetzerTrendChart";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { getPlayerPic } from "@/utils/get-player-pics";
import { schmetzerScoreFrom } from "@/utils/fine-tuning";

export default function PlayerDetailDialog({
  player,
  open,
  onClose,
  seasonStats,
  season,
  weights,
  isTuned = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imgUrl, setImgUrl] = useState(null);
  // The seasons as served: raw counts and the published score, kept unconverted so
  // custom weights can be applied to them below without a refetch.
  const [seasonRows, setSeasonRows] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (player?.player_name && season) {
      const playerNameParam = player.player_name.replace(/\s/g, "");
      fetch(
        `/api/schmetzer_scores/player?season=${season}&playerName=${playerNameParam}`,
      )
        .then((r) => r.json())
        .then((data) => {
          if (isMounted && Array.isArray(data[1])) {
            // The route matches on name alone, and names repeat: 2022 has two Alan
            // Francos (b. 1996 and 1998). Keep only this player's own seasons, or the
            // trend line splices two careers together.
            setSeasonRows(
              data[1].filter(
                (row) =>
                  !player.player_yob ||
                  !row.player_yob ||
                  row.player_yob === player.player_yob,
              ),
            );
          }
        })
        .catch((err) => {
          // A dropped request (dev server restarting, offline) should leave the
          // trend chart empty, not take down the page as an unhandled rejection.
          console.warn("Failed to load player season history:", err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [player, season]);

  useEffect(() => {
    let isMounted = true;
    if (player?.player_name) {
      getPlayerPic(player.player_name).then((res) => {
        if (isMounted && res?.imgThumbUrl) {
          setImgUrl(res.imgThumbUrl);
        }
      })
      .catch((err) => {
        console.warn("Failed to load player headshot:", err);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [player]);

  // Past seasons are stored at the published weights, so a tuned view has to re-score
  // them from their raw counts -- otherwise the trend line ends on a figure that
  // contradicts the score printed above it.
  const schmetzerHistory = useMemo(
    () =>
      seasonRows.map((row) => ({
        year: String(row.season),
        score: isTuned ? schmetzerScoreFrom(weights, row) : row.schmetzer_score,
      })),
    [seasonRows, isTuned, weights],
  );

  if (!player) return null;

  // Route returns object in array
  const stats = Array.isArray(seasonStats) ? seasonStats[0] : seasonStats;

  const seasonAverages = {
    ADW: stats?.adw_avg || 0,
    ADL: stats?.adl_avg || 0,
    TKW: stats?.tkw_avg || 0,
    INT: stats?.int_avg || 0,
    RECOV: stats?.recov_avg || 0,
    smetz_avg: stats?.smetz_avg || 0,
  };

  const seasonMaxes = {
    ADW: stats?.adw_max || 0,
    ADL: stats?.adl_max || 0,
    TKW: stats?.tkw_max || 0,
    INT: stats?.int_max || 0,
    RECOV: stats?.recov_max || 0,
    smetz_max: stats?.smetz_max || 0,
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Player Info */}
      <DialogTitle
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "#17171B"
              : theme.palette.common.white,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box
            display="flex"
            alignItems={isMobile ? "flex-start" : "center"}
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
          >
            <Avatar
              src={imgUrl || undefined}
              sx={{
                width: 80,
                height: 80,
                fontSize: "3rem",
                pt: "6px",
                bgcolor: imgUrl
                  ? "transparent"
                  : theme.palette.mode === "dark"
                    ? "transparent"
                    : theme.palette.common.black,
                color: imgUrl ? "inherit" : theme.palette.common.white,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black
                }`,
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              {!imgUrl && getInitials(player.player_name)}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "2.6rem",
                  letterSpacing: "0.03em",
                  lineHeight: "1em",
                }}
              >
                {player.player_name}
              </Typography>
              <Typography>
                {player.squad} • {player.position} • {player.player_age}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "white"
                    : theme.palette.common.black,
              }}
            />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "#17171B"
              : theme.palette.common.white,
        }}
      >
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={0}
              height={"100%"}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <SchmetzerScoreBar
                value={player.schmetzer_score}
                average={seasonAverages.smetz_avg}
                max={seasonMaxes.smetz_max}
                rank={player.schmetzer_rk}
                totalRanks={stats?.total_ranks}
                guaranteedComp={player.guaranteed_comp}
                scorePerMillion={player.schmetzer_score_per_million}
                tuned={isTuned}
                darkMode={theme.palette.mode === "dark"}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={0}
              height="100%"
              width="100%"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <PlayerMetricsVerticalBarChart
                metrics={{
                  ADW: player.aerial_duels_won,
                  ADL: player.aerial_duels_lost,
                  TKW: player.tackles_won,
                  INT: player.interceptions,
                  RECOV: player.recoveries,
                }}
                averages={seasonAverages}
                maxes={seasonMaxes}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={0}
              height={"100%"}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <PlayerDuelsPieChart player={player} />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={0}
              height={"100%"}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <SchmetzerTrendChart history={schmetzerHistory} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
