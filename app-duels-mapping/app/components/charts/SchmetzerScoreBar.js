"use client";

import { Box, Tooltip } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, Tooltip as ChartTooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ChartTooltip);

export default function SchmetzerScoreBar({ value, average = 150, darkMode = false }) {
  const max = 300;
  const percentage = (value / max) * 100;
  const avgPosition = (average / max) * 100;

  const background = darkMode
    ? "linear-gradient(to right, #B7F08E, #3B5B84)"
    : "#1976d2";

  return (
    <Tooltip title={`Score: ${value}`} arrow>
      <Box sx={{ height: 15, position: 'relative' }}>
        <Box
          sx={{
            width: `${percentage}%`,
            height: 15,
            background: background,
            borderRadius: 4,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: 15,
            border: '2px solid #1976d2',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 4,
            backgroundColor: 'white',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: `${avgPosition}%`,
            transform: 'translate(-50%, -50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: darkMode ? 'white' : 'limegreen',
            zIndex: 2,
          }}
        />
      </Box>
    </Tooltip>
  );
}
