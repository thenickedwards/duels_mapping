"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

// `align="right"` pushes the value to the cell's right edge instead of sitting it in a
// fixed-width box at the left. Wide, variable-length values (currency especially) only
// line up column-wise when they share a right edge.
const RightAlignedCenterCell = ({ value, className = "", align = "left" }) => (
  <Box
    className={className}
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        minWidth: align === "right" ? "auto" : "52px",
        textAlign: "right",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.5,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default RightAlignedCenterCell;
