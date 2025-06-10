"use client";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { baseButtonStyle } from "./buttonStyles";

export default function FilterChip({ label, onRemove }) {
  const theme = useTheme();

  return (
    <Button
      onClick={onRemove}
      sx={{
        ...baseButtonStyle(theme),
        display: "flex",
        alignItems: "center",
        gap: "8px",
        paddingRight: "16px",
        paddingLeft: "16px",
      }}
    >
      <CloseIcon sx={{ fontSize: "1.2rem" }} />
      {label}
    </Button>
  );
}