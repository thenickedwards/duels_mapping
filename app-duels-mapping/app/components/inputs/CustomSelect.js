"use client";

import { Select, MenuItem, OutlinedInput, FormControl } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { inputStyle } from "../../styles/inputStyles";

const SelectIcon = (iconProps) => <ArrowForwardIosIcon {...iconProps} />;

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  showPlaceholder = true,
}) {
  const theme = useTheme();

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <Select
        value={value ?? ""}
        onChange={onChange}
        displayEmpty
        input={<OutlinedInput />}
        IconComponent={ArrowForwardIosIcon}
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
              "& .MuiMenuItem-root": {
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.16)"
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
    </FormControl>
  );
}
