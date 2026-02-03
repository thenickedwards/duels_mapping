"use client";

import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { inputStyle } from "@/app/styles/inputStyles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function SquadSelect({ options = [], value, onChange }) {
  const theme = useTheme();

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <Select
        displayEmpty
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput />}
        IconComponent={ArrowForwardIosIcon}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ opacity: 0.7 }}>All Squads</span>;
          }
          return selected;
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              maxHeight: 300,
              width: 260,
              borderRadius: 0,
              boxShadow: "none",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.common.black
                  : theme.palette.common.white,
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? theme.palette.common.white
                  : theme.palette.common.black
              }`,
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.16)"
                    : "rgba(25,118,210,0.12)",
              },
            },
          },
        }}
        sx={(theme) => ({
          ...inputStyle(theme),
          minHeight: 40,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
          // ▼ icon closed (down)
          "& .MuiSelect-icon": {
            transform: "rotate(90deg)",
            transition: "transform 0.2s ease",
            fontSize: "1.2rem",
            marginRight: "12px",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
          },
          // ▲ icon open (up)
          "& .MuiSelect-iconOpen": {
            transform: "rotate(-90deg)",
          },
        })}
      >
        <MenuItem value="">
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
            }}
          >
            All Squads
          </Typography>
        </MenuItem>

        {options.map((squad) => (
          <MenuItem key={squad} value={squad}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              }}
            >
              {squad}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
