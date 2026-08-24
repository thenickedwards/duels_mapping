"use client";

import { Select, MenuItem, OutlinedInput, FormControl } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { inputStyle } from "../../styles/inputStyles";

/**
 * Multi-select dropdown for the filter drawer.
 *
 * value is an array and onChange is handed an array, so a filter can hold several
 * choices at once -- comparing two clubs, or defenders and midfielders together.
 * An empty array means "no filter", which is why there is no explicit "All" option:
 * clearing every entry is the same thing, and an "All" row that had to be deselected
 * alongside real choices reads as one more position.
 *
 * Selection is shown by colouring the row rather than by a checkbox, using the same
 * accent the masthead uses -- limegreen on light, blue on dark.
 *
 * summarize is optional: given the selected values it may return a short label to show
 * in place of a long comma-joined list, so the caller can name a combination that means
 * something ("All outfield") without this component knowing what positions are.
 *
 * A plain string value is accepted and treated as a single selection, so a caller that
 * has not been migrated still renders.
 */
export default function CustomSelect({
  value = [],
  onChange,
  options = [],
  placeholder = "Select an option",
  summarize,
}) {
  const theme = useTheme();
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const isDark = theme.palette.mode === "dark";
  const accent = isDark
    ? theme.palette.common.blue
    : theme.palette.common.limegreen;
  const onAccent = isDark
    ? theme.palette.common.white
    : theme.palette.common.black;

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
          const summary = summarize?.(chosen);
          if (summary) return summary;
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
              backgroundColor: isDark
                ? theme.palette.common.black
                : theme.palette.common.white,
              border: `1px solid ${
                isDark ? theme.palette.common.white : theme.palette.common.black
              }`,
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              "& .MuiMenuItem-root": {
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              },
              // Selection is carried entirely by colour here, so it has to survive
              // hover -- an unselected row hovered must not look like a selected one.
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: accent,
                color: onAccent,
                fontWeight: 700,
              },
              "& .MuiMenuItem-root.Mui-selected:hover": {
                backgroundColor: accent,
                color: onAccent,
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: isDark ? "#26262A" : "#f2f2f2",
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
            color: isDark
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
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
