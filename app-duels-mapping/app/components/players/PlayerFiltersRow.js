import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ClickAwayListener,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faSquareCheck,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";

import ColumnsBlack from "../../../public/images/columns-icon.png";
import ColumnsWhite from "../../../public/images/columns-wh-icon.png";
import ExportBlack from "../../../public/images/export-icon.png";
import ExportWhite from "../../../public/images/export-wh-icon.png";

export default function PlayerFiltersRow({
  filters,
  onOpenFilterDrawer,
  columns,
  hiddenColumns,
  toggleColumnVisibility,
  setHiddenColumns,
  filteredRows,
  selectedYear,
  exportToCSV,
  showFilterCount = true, // desktop: true, mobile: false
  baseButtonStyle,
}) {
  const theme = useTheme();
  const [showColumns, setShowColumns] = useState(false);

  const filterCount = [
    filters.position,
    filters.squad,
    filters.minMinutes,
  ].filter(Boolean).length;

  return (
    <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
      {/* Filters */}
      <Button
        variant="outlined"
        startIcon={
          <FontAwesomeIcon icon={faSliders} style={{ fontSize: "15px" }} />
        }
        onClick={onOpenFilterDrawer}
        sx={baseButtonStyle(theme)}
      >
        Filters
        {showFilterCount && filterCount > 0 ? ` (${filterCount})` : ""}
      </Button>

      {/* Columns Dropdown */}
      <ClickAwayListener onClickAway={() => setShowColumns(false)}>
        <Box position="relative">
          <Button
            variant="outlined"
            onClick={() => setShowColumns(!showColumns)}
            startIcon={
              <Image
                src={
                  theme.palette.mode === "dark" ? ColumnsWhite : ColumnsBlack
                }
                alt="Columns"
                height={14}
                style={{
                  borderRadius: 0,
                  objectFit: "contain",
                  imageRendering: "crisp-edges",
                }}
              />
            }
            sx={baseButtonStyle(theme)}
          >
            Columns
          </Button>

          {showColumns && (
            <Box
              position="absolute"
              top={50}
              left={0}
              width={220}
              height={250}
              overflow="auto"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              border={`1px solid ${
                theme.palette.mode === "dark"
                  ? theme.palette.common.white
                  : theme.palette.common.black
              }`}
              bgcolor={
                theme.palette.mode === "dark"
                  ? theme.palette.common.black
                  : theme.palette.common.white
              }
              borderRadius={0}
              zIndex={10}
            >
              <Box p={2} overflow="auto">
                {columns.map((col) => (
                  <Box
                    key={col.field}
                    display="flex"
                    alignItems="center"
                    mb={1.5}
                    sx={{ cursor: "pointer" }}
                    onClick={() => toggleColumnVisibility(col.field)}
                  >
                    {hiddenColumns.includes(col.field) ? (
                      // Unchecked: custom box with border
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "3px",
                          border: `1px solid ${
                            theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black
                          }`,
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      // Checked: FontAwesome icon
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        style={{
                          fontSize: "1.2rem",
                          marginRight: 8,
                          color:
                            theme.palette.mode === "dark" ? theme.palette.common.white : "black",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.875rem",
                      }}
                    >
                      {col.displayName}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={1.5}
                py={0.4}
                borderTop={`1px solid ${
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black
                }`}
                bgcolor={
                  theme.palette.mode === "dark" ? "#1a1a1a" : "#f2f2f2"
                }
              >
                <Button
                  variant="text"
                  onClick={() => {
                    const areAllVisible = columns.every(
                      (col) => !hiddenColumns.includes(col.field)
                    );
                    setHiddenColumns(
                      areAllVisible ? columns.map((col) => col.field) : []
                    );
                  }}
                  startIcon={
                    <FontAwesomeIcon
                      icon={faSquareMinus}
                      style={{
                        fontSize: "1.2rem",
                        marginRight: 6,
                        color:
                          theme.palette.mode === "dark" ? theme.palette.common.white : "black",
                      }}
                    />
                  }
                  sx={{
                    fontSize: "0.875rem",
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: theme.palette.text.primary,
                  }}
                >
                  SHOW/HIDE ALL
                </Button>
                <Button
                  variant="text"
                  onClick={() => setHiddenColumns([])}
                  sx={{
                    fontSize: "0.875rem",
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: theme.palette.text.primary,
                  }}
                >
                  RESET
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </ClickAwayListener>

      {/* Export Button */}
      <Button
        variant="outlined"
        onClick={() =>
          exportToCSV(filteredRows, `schmetzer_scores_${selectedYear}.csv`)
        }
        startIcon={
          <Image
            src={theme.palette.mode === "dark" ? ExportWhite : ExportBlack}
            alt="Export"
            height={14}
            style={{
              borderRadius: 0,
              objectFit: "contain",
              imageRendering: "crisp-edges",
            }}
          />
        }
        sx={baseButtonStyle(theme)}
      >
        Export
      </Button>
    </Box>
  );
}
