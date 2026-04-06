"use client";

import { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { baseChartTooltipOptions } from "./styles/chartTooltipOptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

function createDiagonalPattern(color) {
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size, 0);
  ctx.stroke();
  return ctx.createPattern(canvas, "repeat");
}

export default function PlayerMetricsLineChart({
  metrics = {},
  averages = {},
  maxes = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const labels = ["ADW", "ADL", "TKW", "INT", "RECOV"];

  const dataValues = labels.map((label) => metrics[label] ?? 0);
  const averageValues = labels.map((label) => Math.round(averages[label] ?? 0));
  const maxValues = labels.map((label) => maxes[label] ?? 0);

  // Colors
  const playerBorder = isDark ? theme.palette.common.limegreen : theme.palette.common.blue;
  const playerFill = isDark ? "rgba(183, 240, 142, 0.25)" : "rgba(59, 91, 132, 0.25)";
  const maxBorder = isDark ? theme.palette.common.blue : theme.palette.common.limegreen;
  const avgBorder = isDark ? theme.palette.common.white : theme.palette.common.black;

  const maxPattern = useMemo(() => {
    if (typeof window === "undefined") return "transparent";
    return createDiagonalPattern(isDark ? "#3B5B84" : "#B7F08E");
  }, [isDark]);

  const data = {
    labels,
    datasets: [
      // Rendered first (front) — player filled area
      {
        label: "Player",
        data: dataValues,
        borderColor: playerBorder,
        borderWidth: 2,
        backgroundColor: playerFill,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 8,
        pointBackgroundColor: playerBorder,
        pointBorderWidth: 0,
        pointHoverBackgroundColor: playerBorder,
        pointHoverBorderColor: isDark ? theme.palette.common.black : theme.palette.common.white,
        pointHoverBorderWidth: 2,
      },
      // Rendered second (middle) — average dotted line
      {
        label: "Avg",
        data: averageValues,
        borderColor: avgBorder,
        borderWidth: 1.5,
        borderDash: [4, 4],
        backgroundColor: "transparent",
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: avgBorder,
      },
      // Rendered last (back) — max filled area
      {
        label: "Max",
        data: maxValues,
        borderColor: maxBorder,
        borderWidth: 1.5,
        backgroundColor: maxPattern,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: maxBorder,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    onHover: (event, elements) => {
      const canvas = event?.native?.target;
      if (!canvas) return;
      canvas.style.cursor = elements?.length ? "pointer" : "default";
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...baseChartTooltipOptions(theme),
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { display: false },
        grid: {
          display: true,
          color: isDark ? "#333" : "#e0e0e0",
          drawBorder: false,
        },
        border: { display: false },
      },
      x: {
        ticks: {
          display: true,
          color: theme.palette.text.primary,
          font: {
            family: "'Bebas Neue', sans-serif",
            size: 13,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
        >
          Player vs MLS
        </Typography>
      </Box>

      <Line data={data} options={options} />

      {/* Legend */}
      <Box display="flex" gap={3} mt={1.5} justifyContent="center">
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 24,
              height: 0,
              borderBottom: `1.5px dashed ${avgBorder}`,
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.8rem",
              color: theme.palette.text.primary,
            }}
          >
            Avg
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 16,
              height: 12,
              backgroundImage: `repeating-linear-gradient(-45deg, ${maxBorder} 0, ${maxBorder} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "6px 6px",
              border: `1px solid ${maxBorder}`,
              borderRadius: "2px",
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.8rem",
              color: theme.palette.text.primary,
            }}
          >
            Max
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
