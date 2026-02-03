import { alpha } from "@mui/material/styles";

// Chart Tooltip options
export const baseChartTooltipOptions = (theme) => ({
  backgroundColor: alpha(theme.palette.common.black, 0.80),
  borderWidth: 1,
  titleColor: theme.palette.common.white,
  bodyColor: theme.palette.common.white,
  titleFont: {
    family: "'Nunito Sans', sans-serif",
    size: 12,
    weight: "600",
  },
  bodyFont: {
    family: "'Nunito Sans', sans-serif",
    size: 11,
  },
  padding: 8,
  cornerRadius: 6,
  displayColors: false,
  caretSize: 6,
  caretPadding: 4,
  usePointStyle: false,
});

// Shared style for all MUI <Tooltip/> components
export const getMuiChartTooltipSlotProps = (theme) => {
  const bg = alpha(theme.palette.common.black, 0.80);

  return {
    tooltip: {
      sx: {
        backgroundColor: bg,
        color: theme.palette.common.white,
        borderRadius: "6px",
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: "0.75rem",
        p: "6px 10px",
        cursor: "pointer",
      },
    },
    arrow: {
      sx: { color: bg, cursor: "pointer" },
    },
  };
};