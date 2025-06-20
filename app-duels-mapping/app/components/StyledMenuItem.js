import { MenuItem } from "@mui/material";

const StyledMenuItem = ({ children, ...props }) => (
  <MenuItem
    {...props}
    sx={{
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.875rem",
    }}
  >
    {children}
  </MenuItem>
);

export default StyledMenuItem;