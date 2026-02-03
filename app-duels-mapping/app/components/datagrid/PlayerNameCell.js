"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { getPlayerPic } from "../../../utils/get-player-pics";

const PlayerNameCell = ({ name }) => {
  const theme = useTheme();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getPlayerPic(name).then((res) => {
      if (isMounted && res?.imgThumbUrl) {
        setImgUrl(res.imgThumbUrl);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [name]);

  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    return (
      parts[0][0]?.toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "")
    );
  };

  return (
    <Box display="flex" alignItems="center" height="100%" gap={1} sx={{cursor: "pointer"}}>
      <Avatar
        src={imgUrl || undefined}
        sx={{
          width: 36,
          height: 36,
          fontSize: "1.25rem",
          bgcolor: imgUrl
            ? "transparent"
            : theme.palette.mode === "dark"
            ? "transparent"
            : theme.palette.common.black,
          color: imgUrl ? "inherit" : "white",
          border: `1px solid ${
            theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black
          }`,
          fontFamily: "'Bebas Neue', sans-serif",
        }}
      >
        {!imgUrl && getInitials(name)}
      </Avatar>
      <Typography
        fontSize="0.9rem"
        sx={{
          textDecoration: "underline",
          textDecorationStyle: "dashed",
          textUnderlineOffset: "3px",
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,

        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default PlayerNameCell;
