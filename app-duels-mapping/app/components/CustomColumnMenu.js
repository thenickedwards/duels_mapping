"use client";
import { GridColumnMenu } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";

export default function CustomColumnMenu(props) {
  const theme = useTheme();

  return (
    <GridColumnMenu
      {...props}
      slots={{
        paper: (slotProps) => (
          <Paper
            {...slotProps}
            elevation={0}
            sx={{
              mt: "30px",
              borderRadius: 0,
              boxShadow: "none",
            }}
          />
        ),
      }}
    />
  );
}
