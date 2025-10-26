import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { getPlayerPic } from "../../utils/get-player-pics";

const PlayerAvatar = ({ player, side }) => {
  const theme = useTheme();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (player?.player_name) {
      getPlayerPic(player.player_name).then((res) => {
        if (isMounted && res?.imgThumbUrl) {
          setImgUrl(res.imgThumbUrl);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [player]);

  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    return (
      parts[0][0]?.toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "")
    );
  };

  if (!player) return null;

  return (
    <Box textAlign="center">
      <Avatar
        src={imgUrl || undefined}
        sx={{
          width: 100,
          height: 100,
          mx: "auto",
          border: "1px solid #000",
          bgcolor: imgUrl ? "transparent" : "black",
          color: imgUrl ? "inherit" : "white",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "3rem",
        }}
      >
        {!imgUrl && getInitials(player.player_name)}
      </Avatar>
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          borderBottom: `4px solid ${
            theme.palette.mode === "dark"
              ? side === "left"
                ? "#B7F08E"
                : "#ffffff"
              : side === "left"
              ? "#A1D17E"
              : "#3B5B84"
          }`,
          display: "inline-block",
        }}
      >
        {player.player_name}
      </Typography>
    </Box>
  );
};

export default PlayerAvatar;
