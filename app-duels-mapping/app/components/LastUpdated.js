import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function LastUpdated() {
    const theme = useTheme();
  return (
    <Box pb={5}>
      <Divider
        sx={{
          my: "20px",
          border: `1px solid ${
            theme.palette.mode === "light" ? "black" : "white"
          }`,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.mode === "dark" ? "#FAFAFA" : "black",
        }}
      >
        Data Last Updated on August 31, 2025 at 9:00 PM EST
      </Typography>
    </Box>
  );
}
