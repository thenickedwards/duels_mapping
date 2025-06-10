"use client";

import {
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  MenuItem,
  Select,
  Drawer,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlayerComparison from "./components/PlayerComparison";
import { useRef } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayerDetailDialog from "./components/PlayerDetailDialog";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { baseButtonStyle } from "./styles/buttonStyles";
import FilterChip from "./styles/FilterChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faMagnifyingGlass,
  faDownload,
  faEye,
  faXmark,
  faChevronDown,
  faSquare,
  faSquareCheck,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ColumnsBlack from "./images/columns-icon.png";
import ColumnsWhite from "./images/columns-wh-icon.png";
import ExportBlack from "./images/export-icon.png";
import ExportWhite from "./images/export-wh-icon.png";
import RightAlignedCenterCell from "./components/RightAlignedCenterCell";
import CustomColumnMenu from "./components/CustomColumnMenu";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PlayersPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "players";
  const season = searchParams.get("season") || "2025";

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    position: "",
    squad: "",
    minMinutes: "",
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showColumns, setShowColumns] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const query = new URLSearchParams({ season });
  if (filters.position) query.set("position", filters.position);
  if (filters.squad) query.set("squad", filters.squad);
  if (filters.minMinutes) query.set("minMinutes", filters.minMinutes);

  const { data, error, isLoading } = useSWR(
    `/api/schmetzer_scores?${query.toString()}`,
    fetcher
  );

  const updateSeason = (year) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("season", year);
    router.replace(`?${newParams.toString()}`);
  };

  const handleTabChange = (_, newTab) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", newTab);
    router.replace(`?${newParams.toString()}`);
  };

  const toggleColumnVisibility = (field) => {
    setHiddenColumns((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const columns = [
    {
      field: "schmetzer_rk",
      headerName: "rk",
      displayName: "Schmetzer Rank",
      width: 70,
    },
    {
      field: "player_name",
      headerName: "Player",
      displayName: "Player",
      width: 180,
    },
    { field: "player_age", headerName: "Age", displayName: "Age", width: 100 },
    { field: "squad", headerName: "Squad", displayName: "Squad", width: 160 },
    {
      field: "position",
      headerName: "POS",
      displayName: "Position",
      width: 100,
    },
    {
      field: "nineties",
      headerName: "90s",
      displayName: "90s",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "schmetzer_score",
      headerName: "smetz",
      displayName: "Schmetzer Score",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "tackles_won",
      headerName: "tkw",
      displayName: "Tackles Won",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "interceptions",
      headerName: "int",
      displayName: "Interceptions",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "recoveries",
      headerName: "recov",
      displayName: "Recoveries",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "aerial_duels_won",
      headerName: "adw",
      displayName: "Aerial Duels Won",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "aerial_duels_lost",
      headerName: "adl",
      displayName: "Aerial Duels Lost",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
    {
      field: "aerial_duels_won_pct",
      headerName: "adw%",
      displayName: "Aerial Duels Won %",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => <RightAlignedCenterCell value={params.value} />,
    },
  ];

  const rows = data?.map((row, i) => ({ id: i, ...row })) || [];

  const filteredRows = rows.filter((row) =>
    row.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function exportToCSV(data, filename) {
    if (!data || data.length === 0) return;

    const header = ["Index", ...Object.keys(data[0])];
    const csv = [header.join(",")]
      .concat(
        data.map((row, i) =>
          [
            i + 1,
            ...header.slice(1).map((field) => JSON.stringify(row[field] || "")),
          ].join(",")
        )
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  }

  const hardcodedYears = ["2025", "2024"];
  const dropdownYears = ["2023", "2022", "2021", "2020", "2019", "2018"];

  return (
    <main style={{ padding: 24 }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          minHeight: 48,
          "& .MuiTab-root": {
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.25rem",
            textTransform: "uppercase",
            minHeight: 48,
            padding: "20px 48px",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
          },
          "& .MuiTab-root.Mui-selected": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#B7F08E" : "#3B5B84",
            color: theme.palette.mode === "dark" ? "#000" : "#fff",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#B7F08E",
            height: "4px",
          },
        }}
      >
        <Tab label="Players" value="players" />
        <Tab label="Comparisons" value="comparisons" />
      </Tabs>
      <Box
        sx={{
          height: "2px",
          backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#000",
          width: "100%",
          mt: "-2px",
        }}
      />

      {tab === "players" && (
        <>
          <Box
            mt={3}
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            {/* Left side buttons */}
            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={
                  <FontAwesomeIcon
                    icon={faSliders}
                    style={{ fontSize: "15px" }}
                  />
                }
                onClick={() => setFilterDrawerOpen(true)}
                sx={baseButtonStyle(theme)}
              >
                Filters
                {(() => {
                  const count = [
                    filters.position,
                    filters.squad,
                    filters.minMinutes,
                  ].filter(Boolean).length;
                  return count > 0 ? ` (${count})` : "";
                })()}
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
                          theme.palette.mode === "dark"
                            ? ColumnsWhite
                            : ColumnsBlack
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
                        theme.palette.mode === "dark" ? "#fff" : "#000"
                      }`}
                      bgcolor={theme.palette.mode === "dark" ? "#000" : "#fff"}
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
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#000"
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
                                    theme.palette.mode === "dark"
                                      ? "#fff"
                                      : "#000",
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
                          theme.palette.mode === "dark" ? "#fff" : "#000"
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
                              areAllVisible
                                ? columns.map((col) => col.field)
                                : []
                            );
                          }}
                          startIcon={
                            <FontAwesomeIcon
                              icon={faSquareMinus}
                              style={{
                                fontSize: "1.2rem",
                                marginRight: 6,
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
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
                  exportToCSV(filteredRows, `schmetzer_scores_${season}.csv`)
                }
                startIcon={
                  <Image
                    src={
                      theme.palette.mode === "dark" ? ExportWhite : ExportBlack
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
                Export
              </Button>
            </Box>

            {/* Right side controls */}
            <Box display="flex" gap={1} alignItems="center">
              {/* Expandable Search */}
              {showSearch ? (
                <ClickAwayListener onClickAway={() => setShowSearch(false)}>
                  <TextField
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Player"
                    sx={{
                      input: {
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "1rem",
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                      "& input::placeholder": {
                        color: theme.palette.mode === "dark" ? "#aaa" : "#888",
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
                              color:
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : "black",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearchTerm("")}
                            sx={{ padding: 0.5 }}
                          >
                            <FontAwesomeIcon
                              icon={faXmark}
                              style={{
                                fontSize: "14px",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : "black",
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ClickAwayListener>
              ) : (
                <IconButton onClick={() => setShowSearch(true)}>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{
                      fontSize: "18px",
                      color: theme.palette.mode === "dark" ? "white" : "black",
                    }}
                  />
                </IconButton>
              )}

              <>
                {hardcodedYears.map((year) => (
                  <Button
                    key={year}
                    onClick={() => updateSeason(year)}
                    sx={baseButtonStyle(theme, season === year, true)}
                  >
                    {year}
                  </Button>
                ))}

                <Box position="relative" width={44} height={40}>
                  <Select
                    value={dropdownYears.includes(season) ? season : ""}
                    onChange={(e) => updateSeason(e.target.value)}
                    displayEmpty
                    IconComponent={() => null}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: "10px",
                          ml: "-8px",
                          maxHeight: 300,
                          width: 100,
                          borderRadius: 0,
                          boxShadow: "none",
                          backgroundColor:
                            theme.palette.mode === "dark" ? "#000" : "#fff",
                          border: `1px solid ${
                            theme.palette.mode === "dark" ? "#fff" : "#000"
                          }`,
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: "0.875rem",
                        },
                      },
                    }}
                    sx={{
                      width: 44,
                      height: 40,
                      backgroundColor: "transparent",
                      border: `1px solid ${
                        theme.palette.mode === "dark" ? "#fff" : "#000"
                      }`,
                      borderRadius: 0,
                      padding: 0,
                      "& .MuiSelect-select": {
                        padding: 0,
                        textIndent: "-9999px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ display: "none" }}>
                      More
                    </MenuItem>
                    {dropdownYears.map((year) => (
                      <MenuItem
                        key={year}
                        value={year}
                        sx={{
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Custom Positioned Icon */}
                  <ArrowForwardIosIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) rotate(90deg)",
                      width: "1em",
                      height: "1em",
                      pointerEvents: "none",
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    }}
                  />
                </Box>
              </>
            </Box>
          </Box>

          {/* Filter Chips Row */}
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {filters.squad && (
              <FilterChip
                label={filters.squad}
                onRemove={() => setFilters({ ...filters, squad: "" })}
              />
            )}
            {filters.position && (
              <FilterChip
                label={filters.position}
                onRemove={() => setFilters({ ...filters, position: "" })}
              />
            )}
            {/* Dropdown Year Chip */}
            {dropdownYears.includes(season) && (
              <FilterChip
                label={season}
                onRemove={() => updateSeason("2025")}
              />
            )}
            {(filters.squad || filters.position) && (
              <Button
                variant="text"
                onClick={() =>
                  setFilters({ position: "", squad: "", minMinutes: "" })
                }
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Bebas Neue', 'sans-serif'",
                  textTransform: "uppercase",
                  color: theme.palette.text.primary,
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          <Box mt={2} sx={{ height: 450, width: "100%" }}>
            {isLoading ? (
              <Typography>Loading…</Typography>
            ) : (
              <DataGrid
                rows={filteredRows}
                columns={columns.filter(
                  (col) => !hiddenColumns.includes(col.field)
                )}
                loading={isLoading}
                onRowClick={(params) => setSelectedPlayer(params.row)}
                components={{
                  ColumnMenu: CustomColumnMenu,
                }}
                sx={{
                  border: "none",

                  // HEADERS
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#26262A" : "#FAFAFA",
                    borderBottom: `2px solid ${
                      theme.palette.mode === "dark" ? "#fff" : "#000"
                    }`,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    "&:hover .MuiDataGrid-columnHeaderTitle": {
                      textDecoration: "underline 1px dashed",
                      textUnderlineOffset: "4px",
                      textDecorationColor:
                        theme.palette.mode === "dark" ? "#fff" : "#000",
                    },
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "2px",
                    width: "100%",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    backgroundColor: "#B7F08E",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    color: "#000!important",
                    padding: "1px",
                    opacity: "1",
                  },

                  // TITLE TEXT
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.125rem",
                    textTransform: "uppercase",
                    color: theme.palette.text.primary,
                  },

                  // CELLS
                  "& .MuiDataGrid-cell": {
                    border: "none",
                  },
                  "& .MuiDataGrid-row": {
                    borderBottom: `1px solid ${
                      theme.palette.mode === "dark" ? "#444" : "#D9D9D9"
                    }`,
                  },

                  // ROW HOVER
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#17171B" : "#F2F2F2",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    "& .MuiDataGrid-iconButtonContainer": {
                      opacity: 1,
                      visibility: "visible",
                    },
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  // Sort button (contains arrow)
                  "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                  },
                  "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortButton": {
                    opacity: "1!important",
                  },
                  "& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortButton":
                    {
                      opacity: 1,
                    },

                  "& .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer":
                    {
                      opacity: 0,
                      visibility: "hidden",
                      transition:
                        "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
                    },
                  "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer":
                    {
                      opacity: 1,
                      visibility: "visible",
                    },
                  "& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer":
                    {
                      opacity: 1,
                      visibility: "visible",
                    },
                }}
              />
            )}
          </Box>

          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
          >
            <Box p={2} width={300}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">Filter Players</Typography>
                <IconButton
                  onClick={() => setFilterDrawerOpen(false)}
                  aria-label="close drawer"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Select
                fullWidth
                value={filters.position}
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="">All Positions</MenuItem>
                <MenuItem value="FW">Forward</MenuItem>
                <MenuItem value="MF">Midfielder</MenuItem>
                <MenuItem value="DF">Defender</MenuItem>
              </Select>

              <TextField
                label="Squad"
                fullWidth
                sx={{ mt: 2 }}
                value={filters.squad}
                onChange={(e) =>
                  setFilters({ ...filters, squad: e.target.value })
                }
              />

              <TextField
                label="Min Minutes"
                fullWidth
                sx={{ mt: 2 }}
                value={filters.minMinutes}
                onChange={(e) =>
                  setFilters({ ...filters, minMinutes: e.target.value })
                }
              />
            </Box>
          </Drawer>

          <Dialog
            open={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            fullWidth
          >
            <DialogTitle>{selectedPlayer?.player_name}</DialogTitle>
            <DialogContent>
              <Typography>Position: {selectedPlayer?.position}</Typography>
              <Typography>Squad: {selectedPlayer?.squad}</Typography>
              <Typography>Age: {selectedPlayer?.player_age}</Typography>
              {/* Add more fields here */}
              <PlayerDetailDialog
                player={selectedPlayer}
                open={!!selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {tab === "comparisons" && (
        <Box mt={4}>
          <Typography>Comparison Tab Content (Coming Soon)</Typography>
          <PlayerComparison />
        </Box>
      )}
    </main>
  );
}
