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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SchmetzerTrendChart({ history = [] }) {
  const theme = useTheme();
  const labels = history.map((d) => `'${d.year.slice(-2)}`);
  const scores = history.map((d) => d.score);

  const current = scores[scores.length - 1];
  const previous = scores[scores.length - 2] ?? current;
  const diff = current - previous;
  const percentChange = ((diff / previous) * 100).toFixed(1);

  const isIncrease = diff >= 0;
  const color = isIncrease ? 'limegreen' : 'tomato';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">SCHMETZER TREND</Typography>
        <Box display="flex" alignItems="center" color={color}>
          {isIncrease ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
          <Typography variant="caption" ml={0.5}>{percentChange}%</Typography>
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
              borderColor: theme.palette.mode === 'dark' ? '#B7F08E' : '#1976d2',
              pointBackgroundColor: theme.palette.mode === 'dark' ? '#B7F08E' : '#1976d2',
              tension: 0.2,
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
              display: true,
              ticks: { display: false },
              beginAtZero: true,
              grid: {
                display: true,
                color: theme.palette.mode === 'dark' ? '#444' : '#ccc',
                drawBorder: false  
              },
              border: {
                display: false
              }
            },
            x: {
              ticks: { color: theme.palette.text.primary },
              grid: {
                display: false,
                drawBorder: false
              }
            },
          },
        }}
      />
    </Box>
  );
}
