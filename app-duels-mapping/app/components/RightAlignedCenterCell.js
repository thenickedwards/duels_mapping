"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

const RightAlignedCenterCell = ({ value, className = "" }) => (
  <Box
    className={className}
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        minWidth: "52px",
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
