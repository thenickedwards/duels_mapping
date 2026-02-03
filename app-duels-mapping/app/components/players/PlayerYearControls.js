"use client";

import { Box, MenuItem, Select, useTheme } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { inputStyle } from "../../styles/inputStyles";
import OutlinedInput from "@mui/material/OutlinedInput";

export default function PlayerYearControls({
  selectedYear,
  updateSeason,
  baseButtonStyle,
  hardcodedYears,
  dropdownYears,

  // Optional callback so Comparisons can show a chip for dropdown years
  onDropdownSelect,
}) {
  const theme = useTheme();
  const black = theme.palette.common.black;
  const white = theme.palette.common.white;

  return (
    <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
      {hardcodedYears.map((year) => (
        <Box
          key={year}
          component="button"
          onClick={() => {
            onDropdownSelect?.(null); // clear chip if switching back to hardcoded year
            updateSeason(year);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Box
            component="span"
            sx={baseButtonStyle(theme, selectedYear === year, true)}
          >
            {year}
          </Box>
        </Box>
      ))}

      {/* Dropdown years */}
      <Box
        position="relative"
        width={44}
        height={40}
        sx={{
          cursor: "pointer",
          transition: "background-color 0.15s ease",
          "&:hover": { 
            backgroundColor: theme.palette.mode === "dark" ? "#26262A" : "#f2f2f2",
          }, 
        }}
      >
        <Select
          value={dropdownYears.includes(selectedYear) ? selectedYear : ""}
          onChange={(e) => {
            const year = e.target.value;
            onDropdownSelect?.(year);
            updateSeason(year);
          }}
          displayEmpty
          input={<OutlinedInput />}
          IconComponent={() => null} 
          MenuProps={{
            PaperProps: {
              sx: {
                mt: "10px",
                ml: "-8px",
                maxHeight: 300,
                width: 100,
                borderRadius: 0,
                boxShadow: "none",
                backgroundColor: theme.palette.mode === "dark" ? black : white,
                border: `1px solid ${theme.palette.mode === "dark" ? white : black}`,
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              },
            },
          }}
          sx={{
            ...inputStyle(theme),
            width: 44,
            height: 40,
            mt: 0,
            mb: 0,
            backgroundColor: "transparent",
            border: `1px solid ${theme.palette.mode === "dark" ? white : black}`,
            borderRadius: 0,
            padding: 0,

            "& .MuiSelect-select": {
              padding: 0,
              textIndent: "-9999px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="" disabled sx={{ display: "none" }}>
            More
          </MenuItem>

          {dropdownYears.map((year) => (
            <MenuItem
              key={year}
              value={year}
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              }}
            >
              {year}
            </MenuItem>
          ))}
        </Select>

        <ArrowForwardIosIcon
          className="yearDropdownArrow"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(90deg)",
            width: "1em",
            height: "1em",
            pointerEvents: "none",
            color: theme.palette.mode === "dark" ? white : black,
          }}
        />
      </Box>
    </Box>
  );
}

