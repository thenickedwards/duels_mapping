"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Tooltip,
  Legend
);

Tooltip.positioners.customBelow = function (elements, eventPosition) {
  const base = Tooltip.positioners.average(elements, eventPosition);
  if (base) {
    return {
      x: base.x,
      y: base.y + 12,
    };
  }
  return base;
};

export default function SchmetzerTrendChart({ history = [] }) {
  const theme = useTheme();
  const labels = history.map((d) => `'${d.year.slice(-2)}`);
  const scores = history.map((d) => d.score);

  const current = scores[scores.length - 1];
  const previous = scores[scores.length - 2] ?? current;
  const diff = current - previous;
  const percentChange = ((diff / previous) * 100).toFixed(1);

  const isIncrease = diff >= 0;
  const color = isIncrease ? "limegreen" : "tomato";

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="subtitle1"
          component={"div"}
          sx={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
        >
          SCHMETZER TREND
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Nunito Sans, sans-serif",
              fontSize: "0.875rem",
              color: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
            }}
          >
            {percentChange}%
          </Typography>

          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: theme.palette.common.limegreen,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isIncrease ? (
              <ArrowUpward
                fontSize="inherit"
                sx={{ color: `${theme.palette.common.black} !important`, fontSize: 16 }}
              />
            ) : (
              <ArrowDownward
                fontSize="inherit"
                sx={{ color: `${theme.palette.common.black} !important`, fontSize: 16 }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Score",
              data: scores,
              borderColor: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
              borderWidth: 2,
              tension: 0.2,
              pointRadius: 2.5,
              pointHoverRadius: 10,
              pointBackgroundColor:
                theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
              pointHoverBackgroundColor: theme.palette.common.limegreen,
              pointBorderColor:
                theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
              pointBorderWidth: 0,
              pointHoverBorderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          interaction: {
            mode: "nearest",
            intersect: true,
          },
          onHover: (event, elements) => {
            const canvas = event?.native?.target;
            if (!canvas) return;
            canvas.style.cursor = elements?.length ? "pointer" : "default";
          },
          plugins: {
            legend: { display: false },
            tooltip: baseChartTooltipOptions(theme),
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { display: false, stepSize: 30 },
              grid: {
                display: true,
                color: theme.palette.mode === "dark" ? "#444" : "#ccc",
                drawBorder: false,
              },
              border: { display: false },
            },
            x: {
              ticks: {
                display: true,
                color: theme.palette.text.primary,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
          },
        }}
      />
    </Box>
  );
}
