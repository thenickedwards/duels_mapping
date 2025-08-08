export const inputStyle = (theme) => ({
  mt: 1,
  mb: 3,
  borderRadius: 0,
  border: `1px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,
  "& .MuiOutlinedInput-root": {
    paddingRight: "40px",
    borderRadius: 0,
    "& fieldset": {
      border: "none",
    },
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
  "& .MuiInputBase-input": {
    fontFamily: "'Nunito Sans', sans-serif",
    fontSize: "1rem",
    padding: "10px 12px",
  },
});
