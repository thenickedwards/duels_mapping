"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ChartTooltip
);

export default function SchmetzerScoreBar({
  value,
  average = 150,
  darkMode = false,
}) {
  const max = 300;
  const percentage = (value / max) * 100;
  const avgPosition = (average / max) * 100;

  const background = darkMode
    ? "linear-gradient(to right, #3B5B84, #B7F08E)"
    : "#3B5B84";

  return (
    <Box>
      <Typography variant="h2" component={"div"} fontSize={"1.6rem"}>
        Schmetzer Score
      </Typography>
      <Typography
        fontFamily={"'Bebas Neue', sans-serif"}
        textAlign="left"
        fontSize={"6rem"}
        fontWeight={"bold"}
        mb={1}
        mt={"-12px"}
      >
        {/* {player.schmetzer_score} */}
        {`${value}`}
      </Typography>

      {/* <Tooltip title={`Score: ${value}`} arrow>
        <Box sx={{ height: 16, position: "relative" }}>
          <Box
            sx={{
              width: `${percentage}%`,
              height: 16,
              background: background,
              borderRadius: 4,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              width: "100%",
              height: 16,
              border: darkMode ? "1px solid #646464" : "1px solid #3B5B84",
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: 4,
              backgroundColor: darkMode ? "#646464" : "#fff",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: `${avgPosition}%`,
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: darkMode ? "#fff" : "1px solid #3B5B84",
              backgroundColor: darkMode ? "#fff" : "#B7F08E",
              zIndex: 2,
            }}
          />
        </Box>
      </Tooltip> */}

      <Tooltip title={`Score: ${value}`} arrow>
        <Box sx={{ height: 16, position: "relative" }}>
          {/* Player score bar */}
          <Box
            sx={{
              width: `${percentage}%`,
              height: 16,
              background,
              borderRadius: 4,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />

          {/* Bar background */}
          <Box
            sx={{
              width: "100%",
              height: 16,
              border: darkMode ? "1px solid #646464" : "1px solid #3B5B84",
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: 4,
              backgroundColor: darkMode ? "#646464" : "#fff",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <Tooltip title={`League Avg: ${average}`} arrow>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: `${avgPosition}%`,
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: darkMode ? "1px solid #fff" : "1px solid #3B5B84",
                backgroundColor: darkMode ? "#fff" : "#B7F08E",
                zIndex: 2,
                cursor: "help", 
              }}
            />
          </Tooltip>
        </Box>
      </Tooltip>
    </Box>
  );
}
