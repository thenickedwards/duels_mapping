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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

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
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
            }}
          >
            {percentChange}%
          </Typography>

          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#B7F08E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isIncrease ? (
              <ArrowUpward
                fontSize="inherit"
                sx={{ color: "#000", fontSize: 16 }}
              />
            ) : (
              <ArrowDownward
                fontSize="inherit"
                sx={{ color: "#000", fontSize: 16 }}
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
              fill: false,
              borderWidth: 1,
              borderColor:
                theme.palette.mode === "dark" ? "#B7F08E" : "#1976d2",
              tension: 0.2,
              pointRadius: 7.5,
              pointHoverRadius: 7.5,
              pointBackgroundColor:
                theme.palette.mode === "dark" ? "#B7F08E" : "#1976d2",
              pointBorderColor: theme.palette.mode === "dark" ? "#fff" : "#000",
              pointBorderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 30, // Adjust this to control spacing (e.g., 50, 100, etc.)
                display: false, // Still hiding tick labels
              },
              border: {
                display: false,
              },
              grid: {
                display: true,
                color: theme.palette.mode === "dark" ? "#444" : "#ccc",
                drawBorder: false,
              },
            },
            x: {
              ticks: { color: theme.palette.text.primary },
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
