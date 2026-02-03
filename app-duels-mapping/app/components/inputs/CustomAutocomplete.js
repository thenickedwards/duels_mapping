"use client";
import React from "react";
import {
  Autocomplete,
  TextField,
  Popper,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { inputStyle } from "@/app/styles/inputStyles";

export default function CustomAutocomplete({
  label = "Select Player",
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  disabledOptions = [],
  ...props
}) {
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black;

  return (
    <>
      {label ? (
        <Typography
          sx={{
            mt: 1,
            mb: 0.5,
            fontSize: "1.6rem",
            letterSpacing: 0,
            fontFamily: "'Bebas Neue', sans-serif",
            fontWeight: 400,
            color: borderColor,
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Autocomplete
        options={options}
        value={value || null}
        onChange={onChange}
        isOptionEqualToValue={(option, val) => option === val}
        getOptionDisabled={(option) => disabledOptions.includes(option)}
        clearIcon={<CloseIcon fontSize="small" />}
        disableClearable={false}
        popupIcon={<ArrowForwardIosIcon />}
        PopperComponent={(popperProps) => (
          <Popper
            {...popperProps}
            modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
            sx={{
              mt: 1,
              border: `1px solid ${borderColor}`,
              borderRadius: 0,
              boxShadow: "none",
              backgroundColor:
                theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
              "& .MuiAutocomplete-option": {
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
              },
              "& .MuiAutocomplete-option[aria-disabled='true']": {
                opacity: 0.45,
              },
            }}
          />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            sx={{
              ...inputStyle(theme),

              // keep the field clickable feel
              "& .MuiOutlinedInput-root": { cursor: "pointer" },
              "& input": { cursor: "pointer" },

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${borderColor} !important`,
                borderRadius: 0,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${borderColor} !important`,
                borderWidth: "2px",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: `${borderColor} !important`,
                  borderWidth: "2px",
                },

              "& .MuiAutocomplete-endAdornment": {
                right: "32px",
              },

              "& .MuiAutocomplete-popupIndicator": {
                backgroundColor: "transparent",
                padding: 0,
                marginRight: "12px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "transparent" },
                "&.Mui-focusVisible": { backgroundColor: "transparent" },
              },

              "& .MuiAutocomplete-popupIndicator .MuiSvgIcon-root": {
                transform: "rotate(90deg)",
                transition: "transform 0.2s ease",
                fontSize: "1.2rem",
                color: borderColor,
              },
              "& .MuiAutocomplete-popupIndicatorOpen .MuiSvgIcon-root": {
                transform: "rotate(-90deg)",
              },

              "& .MuiAutocomplete-clearIndicator": {
                backgroundColor: "transparent",
                padding: 0,
                cursor: "pointer",
                "&:hover": { backgroundColor: "transparent" },
                "&.Mui-focusVisible": { backgroundColor: "transparent" },
                "& .MuiSvgIcon-root": { color: borderColor },
              },
            }}
          />
        )}
        {...props}
      />
    </>
  );
}
