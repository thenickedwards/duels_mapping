// components/PlayerDetailDialog.js
"use client";

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


export default function PlayerDetailDialog({ player, open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!player) return null;

  const fallbackInitials = getInitials(player.player_name);
  const hasImage = !!player.player_image;

  const schmetzerHistory = [
    { year: "2020", score: 75 },
    { year: "2021", score: 100.25 },
    { year: "2022", score: 90 },
    { year: "2023", score: 95 },
    { year: "2024", score: 102 },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
<DialogTitle>
  <Box display="flex" justifyContent="space-between" alignItems="start">
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        src={hasImage ? player.player_image : undefined}
        sx={{ width: 60, height: 60, bgcolor: hasImage ? "transparent" : "black", color: "white" }}
      >
        {!hasImage && fallbackInitials}
      </Avatar>
      <Box>
        <Typography variant="overline" sx={{ color: "green" }}>{player.schmetzer_rk} PLACE</Typography>
        <Typography variant="h5" fontWeight="bold">{player.player_name}</Typography>
        <Typography>{player.squad} • {player.position} • {player.player_age}</Typography>
      </Box>
    </Box>
    <IconButton onClick={onClose} aria-label="close">
      <CloseIcon />
    </IconButton>
  </Box>
</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box p={2} borderRadius={2} border="1px solid #ddd">
              <Typography variant="subtitle2" gutterBottom>SCHMETZER SCORE</Typography>
              <Typography variant="h3" fontWeight="bold" textAlign="center" mb={1}>{player.schmetzer_score}</Typography>
              <SchmetzerScoreBar value={player.schmetzer_score} average={150} darkMode={theme.palette.mode === 'dark'} />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box p={2} borderRadius={2} border="1px solid #ddd">
              <PlayerMetricsBarChart
                metrics={{ INT: player.interceptions, TKW: player.tackles_won, RECOV: player.recoveries, ADW: player.aerial_duels_won, ADL: player.aerial_duels_lost }}
                averages={{ INT: 20, TKW: 18, RECOV: 30, ADW: 15, ADL: 5 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box p={2} borderRadius={2} border="1px solid #ddd">
              <PlayerRadarChart player={player} />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box p={2} borderRadius={2} border="1px solid #ddd">
              <SchmetzerTrendChart history={schmetzerHistory} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
