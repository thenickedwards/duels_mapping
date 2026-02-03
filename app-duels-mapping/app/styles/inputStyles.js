export const inputStyle = (theme) => {
  const borderColor = theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black;

  return {
    mt: 1,
    mb: 3,
    borderRadius: 0,

    // ---- Outline border control ----
    // Works for: Select + OutlinedInput, TextField variant="outlined", etc.
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
      {
        borderColor: `${borderColor} !important`,
        borderWidth: "1px",
      },

    // Hover (set 1px or 2px)
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor: `${borderColor} !important`,
        borderWidth: "2px",
      },

    // Focused / menu open (kills blue)
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor: `${borderColor} !important`,
        borderWidth: "2px",
      },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${borderColor} !important`,
      borderWidth: "2px",
    },

    "& .MuiSelect-select": {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "1rem",
      paddingRight: "32px",
    },

    "& input": {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "1rem",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: 0,
    },
  };
};
