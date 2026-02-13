import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function LastUpdated({ lastUpdated }) {
  const theme = useTheme();

  // Get load_datetime and fallbacks
  const formatDate = (dateString) => {
    if (!dateString) return "loading...";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown Date";

    // Detect user's time zone or default to US/Pacific
    const userTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "US/Pacific";

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: userTimeZone,
      timeZoneName: "short",
    });
  };

  return (
    <Box pb={5}>
      <Divider
        sx={{
          my: "20px",
          border: `1px solid ${
            theme.palette.mode === "light"
              ? theme.palette.common.black
              : theme.palette.common.white
          }`,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color:
            theme.palette.mode === "dark"
              ? "#FAFAFA"
              : theme.palette.common.black,
        }}
      >
        Data last updated {formatDate(lastUpdated)}
      </Typography>
    </Box>
  );
}
