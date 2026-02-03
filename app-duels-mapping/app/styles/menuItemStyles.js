export const selectedMenuItemStyles = (theme) => ({
  "& .MuiMenuItem-root.Mui-selected": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#26262A" : "#f2f2f2",
  },
  "& .MuiMenuItem-root.Mui-selected:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#26262A" : "#f2f2f2",
  },
});
