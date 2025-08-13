"use client";
import { forwardRef } from "react";
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
  showPlaceholder = true,
  ...props
}) {
  const theme = useTheme();

  const CustomDropdownIcon = forwardRef(function CustomDropdownIcon(props, ref) {
    return (
      <ArrowForwardIosIcon
        {...props}
        ref={ref}
        sx={{
          transform: "rotate(90deg)",
          fontSize: "1.25rem",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#fff" : "#000",
          pointerEvents: "auto", 
          cursor: "pointer",
          mr: 1,
        }}
      />
    );
  });

  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      fullWidth
      {...props}
    IconComponent={CustomDropdownIcon}
      renderValue={(selected) => {
        const selectedOption = options.find((opt) => opt.value === selected);
        if (selectedOption) {
          return selectedOption.label;
        }
        if (showPlaceholder) {
          return <span style={{ color: "#888" }}>{placeholder}</span>;
        }
        return "";
      }}
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
      {showPlaceholder && (
        <MenuItem value="" disabled sx={{ display: "none" }}>
          {placeholder}
        </MenuItem>
      )}
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
