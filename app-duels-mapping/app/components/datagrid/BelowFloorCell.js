"use client";
import { Box, Tooltip, useTheme } from "@mui/material";
import { getMuiChartTooltipSlotProps } from "../charts/styles/chartTooltipOptions";
import RightAlignedCenterCell from "./RightAlignedCenterCell";
import { MIN_NINETIES_FOR_AVERAGES } from "@/utils/request-context";

// Stands in for a per-90 rate the grid withholds: a player under the floor has too few
// minutes for the rate to mean much, and left in, a cameo tops any per-90 sort.
const BelowFloorCell = ({ nineties }) => {
  const theme = useTheme();
  return (
    <RightAlignedCenterCell
      value={
        <Tooltip
          title={`Below minutes floor: ${nineties ?? 0} 90s played, ${MIN_NINETIES_FOR_AVERAGES} needed for per-90 rate`}
          arrow
          placement="top"
          slotProps={getMuiChartTooltipSlotProps(theme)}
        >
          <Box component="span" sx={{ cursor: "help", opacity: 0.65 }}>
            *
          </Box>
        </Tooltip>
      }
    />
  );
};

export default BelowFloorCell;
