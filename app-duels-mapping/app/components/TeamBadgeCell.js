"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";

const formatBadgeFileName = (squad) => {
  return squad
    .toLowerCase()
    .replace(/[.’']/g, "")     // remove punctuation
    .replace(/\s+/g, "-");     // replace spaces with dashes
};

const TeamBadgeCell = ({ squad }) => {
  const badgeFileName = formatBadgeFileName(squad);
  const badgeSrc = `/team-badges/${badgeFileName}.png`;

  return (
    <Box display="flex" alignItems="center" height={"100%"} gap={1}>
      <Image
        src={badgeSrc}
        alt={`${squad} logo`}
        width={28}
        height={28}
        style={{ borderRadius: "4px" }}
      />
      <Typography fontSize="0.9rem">{squad}</Typography>
    </Box>
  );
};

export default TeamBadgeCell;
