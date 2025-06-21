"use client";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Popper,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { inputStyle } from "../styles/inputStyles";
import CloseIcon from "@mui/icons-material/Close";

export default function CustomAutocomplete({
  label = "Select Player",
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  ...props
}) {
  const theme = useTheme();

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      clearIcon={<CloseIcon fontSize="small" />}
      disableClearable={false}
      popupIcon={null}
      PopperComponent={(props) => (
        <Popper
          {...props}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          sx={{
            mt: 1,
            border: `1px solid ${
              theme.palette.mode === "dark" ? "#fff" : "#000"
            }`,
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor:
              theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
            "& .MuiAutocomplete-option": {
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
            },
          }}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          placeholder={placeholder}
          slotProps={{
            inputLabel: {
              shrink: true,
              sx: {
                mt: "-30px",
                ml: "-16px",
                fontSize: "1.8rem",
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 400,
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                "&.Mui-focused": {
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                },
              },
            },
            input: {
              ...params.InputProps,
              sx: {
                pr: 6, 
              },
              endAdornment: (
                <>
                  <ArrowForwardIosIcon
                    sx={{
                      transform: "rotate(90deg)",
                      pointerEvents: "none",
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      fontSize: "1.25rem",
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transformOrigin: "center",
                      translate: "0 -50%",
                    }}
                  />
                   {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          sx={inputStyle(theme)}
        />
      )}
      {...props}
    />
  );
}
