import { TextField, InputAdornment, IconButton, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function PlayerSearchField({
  value,
  onChange,
  onClear,
  fullWidth = false,
  autoFocus = false,
  placeholder = "Search Player",
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      sx={{
        input: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "1rem",
          color: isDark
            ? theme.palette.common.white
            : theme.palette.common.black,
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: isDark
            ? theme.palette.common.white
            : theme.palette.common.black,
        },
        "& .MuiInput-underline:hover:before": {
          borderBottomColor: isDark
            ? theme.palette.common.white
            : theme.palette.common.black,
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: isDark
            ? theme.palette.common.white
            : theme.palette.common.black,
        },
        "& input::placeholder": {
          color: isDark ? "#aaa" : "#888",
          opacity: 1,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{
                fontSize: "18px",
                color: isDark
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              }}
            />
          </InputAdornment>
        ),
        endAdornment:
          value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear} sx={{ p: 0.5 }}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{
                    fontSize: "14px",
                    color: isDark
                      ? theme.palette.common.white
                      : theme.palette.common.black,
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
      }}
    />
  );
}
