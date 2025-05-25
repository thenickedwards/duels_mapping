"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";

export default function PlayerMetricsBarChart({ metrics = {}, averages = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const labels = ["INT", "TKW", "RECOV", "ADW", "ADL"];

  const dataValues = labels.map(label => metrics[label] ?? 0);
  const averageValues = labels.map(label => averages[label] ?? 0);

  return (
    <Box>
      {labels.map((label, index) => {
        const value = dataValues[index];
        const average = averageValues[index];
        const percent = (value / 100) * 100;
        const avgPos = (average / 100) * 100;

        return (
          <Box key={label} mb={2} display="flex" alignItems="center" justifyContent="space-between">
            <Typography sx={{ minWidth: 40 }}>{label}</Typography>
            <Box sx={{ flex: 1, position: 'relative', mx: 1 }}>
              <Tooltip title={`Value: ${value}`} arrow>
                <Box
                  sx={{
                    height: 12,
                    width: `${percent}%`,
                    background: isDark ? 'linear-gradient(to right, #B7F08E, #3B5B84)' : '#1976d2',
                    borderRadius: 4,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
              </Tooltip>
              <Box
                sx={{
                  height: 12,
                  width: '100%',
                  border: '2px solid #1976d2',
                  backgroundColor: 'white',
                  borderRadius: 4,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />
              <Tooltip title={`Avg: ${average}`} arrow>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: `${avgPos}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'white' : 'limegreen',
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            </Box>
            <Typography sx={{ minWidth: 24, textAlign: 'right' }}>{value}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
