"use client";

import {
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { inputStyle } from "../../styles/inputStyles";

/**
 * Multi-select dropdown for the filter drawer.
 *
 * value is an array and onChange is handed an array, so a filter can hold several
 * choices at once -- comparing two clubs, or defenders and midfielders together.
 * An empty array means "no filter", which is why there is no explicit "All" option:
 * clearing every checkbox is the same thing, and an "All" entry that had to be
 * deselected alongside real choices reads as a fourth position.
 *
 * A plain string value is accepted and treated as a single selection, so a caller
 * that has not been migrated still renders.
 */
export default function CustomSelect({
  value = [],
  onChange,
  options = [],
  placeholder = "Select an option",
}) {
  const theme = useTheme();
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <Select
        multiple
        value={selected}
        onChange={(event) => {
          // The native select hands back a comma-joined string on autofill
          const next = event.target.value;
          onChange(typeof next === "string" ? next.split(",") : next);
        }}
        displayEmpty
        input={<OutlinedInput />}
        IconComponent={ArrowForwardIosIcon}
        renderValue={(chosen) => {
          if (!chosen.length) {
            return <span style={{ color: "#888" }}>{placeholder}</span>;
          }
          return options
            .filter((opt) => chosen.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ");
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
            // Several selections stay on one line rather than growing the control
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} dense>
            <Checkbox
              checked={selected.includes(opt.value)}
              size="small"
              sx={{
                p: 0.5,
                mr: 1,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                "&.Mui-checked": {
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.common.white
                      : theme.palette.common.black,
                },
              }}
            />
            <ListItemText
              primary={opt.label}
              primaryTypographyProps={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
