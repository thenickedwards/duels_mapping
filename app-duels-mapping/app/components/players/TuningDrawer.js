"use client";

import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SCHMETZER_STATS } from "@/utils/fine-tuning";
import { inputStyle } from "../../styles/inputStyles";
import {
  primaryActionButtonStyle,
  textActionButtonStyle,
} from "../../styles/buttonStyles";

/*
The Fine Tuning drawer: one field per weighted statistic, holding whatever the user
typed rather than a number, so a half-finished "-0." survives the next keystroke. The
parent parses the inputs and re-scores as they change, so the leaderboard behind the
drawer moves with every edit and "Update" only closes.
*/
export default function TuningDrawer({
  open,
  onClose,
  weightInputs,
  onChangeWeight,
  onReset,
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={(theme) => ({
          width: 400,
          height: "100%",
          // Five fields plus the blurb outrun a short viewport where the three-control
          // Filters drawer does not, so this one scrolls.
          overflowY: "auto",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.common.black
              : "#FAFAFA",
          borderLeft: `4px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.common.limegreen
              : theme.palette.common.white
          }`,
          paddingTop: "50px",
          paddingX: "40px",
        })}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h3"
            fontSize="1.25rem"
            sx={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Fine Tuning
          </Typography>
          <IconButton onClick={onClose} aria-label="close drawer" size="small">
            <CloseIcon
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
              }}
            />
          </IconButton>
        </Box>

        <Typography variant="body2" mb={3}>
          Set your own point value for each statistic. Every score, rank and value
          figure on the page is recalculated as you type, and the standard weights come
          back on refresh.
        </Typography>

        {SCHMETZER_STATS.map(({ stat, label, defaultWeight }) => (
          <Box key={stat}>
            <Typography variant="h4" fontSize="1rem" mb={-0.5}>
              {label}
            </Typography>
            <TextField
              fullWidth
              value={weightInputs[stat] ?? ""}
              onChange={(e) => onChangeWeight(stat, e.target.value)}
              placeholder={String(defaultWeight)}
              inputProps={{
                inputMode: "decimal",
                "aria-label": `${label} weight`,
              }}
              sx={(theme) => inputStyle(theme)}
            />
          </Box>
        ))}

        {/* Buttons */}
        <Box mt={4} mb={6} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={onReset}
            sx={(theme) => textActionButtonStyle(theme)}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            sx={(theme) => primaryActionButtonStyle(theme)}
            onClick={onClose}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
