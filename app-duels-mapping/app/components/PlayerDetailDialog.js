"use client";
import React, { useEffect, useState } from "react";
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
import { getInitials } from "../../utils/getInitials";
import SchmetzerScoreBar from "./charts/SchmetzerScoreBar";
import PlayerMetricsBarChart from "./charts/PlayerMetricsBarChart";
import PlayerRadarChart from "./charts/PlayerRadarChart";
import SchmetzerTrendChart from "./charts/SchmetzerTrendChart";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { getPlayerPic } from "./../../utils/get-player-pics";

export default function PlayerDetailDialog({ player, open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (player?.player_name) {
      getPlayerPic(player.player_name).then((res) => {
        if (isMounted && res?.imgThumbUrl) {
          setImgUrl(res.imgThumbUrl);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [player]);

  if (!player) return null;

  const schmetzerHistory = [
    { year: "2020", score: 75 },
    { year: "2021", score: 100.25 },
    { year: "2022", score: 90 },
    { year: "2023", score: 95 },
    { year: "2024", score: 102 },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Player Info */}
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#17171B" : "white",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box display="flex" alignItems="center" gap={2}>
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
                  : "black",
                color: imgUrl ? "inherit" : "white",
                border: `1px solid ${
                  theme.palette.mode === "dark" ? "white" : "black"
                }`,
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              {!imgUrl && getInitials(player.player_name)}
            </Avatar>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  letterSpacing: "0.03em",
                  lineHeight: "1em",
                }}
              >
                {player.schmetzer_rk} PLACE
              </Typography>
      
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
              sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
            />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#17171B" : "#fff",
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
              {/* <Typography variant="h2" component={"div"} fontSize={"1.6rem"}>
                SCHMETZER SCORE
              </Typography>
              <Typography
                fontFamily={"'Bebas Neue', sans-serif"}
                textAlign="left"
                fontSize={"6rem"}
                fontWeight={"bold"}
                mb={1}
                mt={"-12px"}
              >
                {player.schmetzer_score}
              </Typography> */}
              <SchmetzerScoreBar
                value={player.schmetzer_score}
                average={150}
                darkMode={theme.palette.mode === "dark"}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={2}
              height="100%"
              width="100%"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <PlayerMetricsBarChart
                metrics={{
                  ADW: player.aerial_duels_won,
                  ADL: player.aerial_duels_lost,
                  TKW: player.tackles_won,
                  INT: player.interceptions,
                  RECOV: player.recoveries,
                }}
                averages={{ ADW: 15, ADL: 5, TKW: 18, INT: 20, RECOV: 30 }}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={2}
              height={"100%"}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303034" : "#FAFAFA",
              }}
            >
              <PlayerRadarChart player={player} />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Box
              p={4}
              borderRadius={2}
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
