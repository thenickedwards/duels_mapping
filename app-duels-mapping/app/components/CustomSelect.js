"use client";
import { Select, MenuItem } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { inputStyle } from "../styles/inputStyles";
import { Box } from "@mui/material";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  ...props
}) {
  const theme = useTheme();

  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      fullWidth
      {...props}
      IconComponent={() => (
        <Box
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowForwardIosIcon
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              fontSize: "1.5rem",
            }}
          />
        </Box>
      )}
      renderValue={(selected) =>
        selected ? (
          selected
        ) : (
          <span style={{ color: "#888" }}>{placeholder}</span>
        )
      }
      MenuProps={{
        PaperProps: {
          sx: {
            mt: 1,
            border: `1px solid ${
              theme.palette.mode === "dark" ? "#fff" : "#000"
            }`,
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor:
              theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
            "& .MuiMenuItem-root": {
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
            },
          },
        },
      }}
      sx={{
        ...inputStyle(theme),
        pr: 5,
        position: "relative",
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <MenuItem value="" disabled sx={{ display: "none" }}>
        {placeholder}
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
