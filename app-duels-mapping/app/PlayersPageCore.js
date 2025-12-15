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
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlayerComparison from "./components/PlayerComparison";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { saveAs } from "file-saver";
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
  faXmark,
  faSquareCheck,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ColumnsBlack from "../public/images/columns-icon.png";
import ColumnsWhite from "../public/images/columns-wh-icon.png";
import ExportBlack from "../public/images/export-icon.png";
import ExportWhite from "../public/images/export-wh-icon.png";
import RightAlignedCenterCell from "./components/RightAlignedCenterCell";
import CustomColumnMenu from "./components/CustomColumnMenu";
import { inputStyle } from "./styles/inputStyles";
import CustomSelect from "./components/CustomSelect";
import PlayerNameCell from "./components/PlayerNameCell";
import TeamBadgeCell from "./components/TeamBadgeCell";
import LastUpdated from "./components/LastUpdated";

const fetcher = (url) => fetch(url).then((r) => r.json());

// Custom Styled Pagination
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    fontFamily: "'Bebas Neue', sans-serif",
    border: `1px solid ${theme.palette.mode === "light" ? "black" : "white"}`,
    color: theme.palette.text.primary,
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    color: theme.palette.mode === "light" ? "black" : "black",
    fontWeight: "bold",
    position: "relative",
    backgroundColor: "transparent",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-3px",
      left: "3px",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: "#B7F08E",
      zIndex: -1,
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    border: "none",
  },
}));

export default function PlayersPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "players";
  // const season = searchParams.get("season") || "2025";
  // --
  const seasonFromUrl =
    searchParams.get("season") || new Date().getFullYear().toString();
  const currentYear = new Date().getFullYear();
  // --

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    position: "",
    squad: "",
    minMinutes: "",
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showColumns, setShowColumns] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([
    "player_age",
    "nineties",
  ]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectOpen, setSelectOpen] = useState(false);

  // ---

  //  const currentYear = new Date().getFullYear();
  //  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedYear, setSelectedYear] = useState(Number(seasonFromUrl));

  const { data: players } = useSWR(
    `/api/schmetzer_scores?season=${selectedYear}`,
    fetcher
  );

  // --

  // const query = new URLSearchParams({ season });
  // ---
  // const query = new URLSearchParams({ seasonFromUrl });
  const query = new URLSearchParams({ season: selectedYear.toString() });

  // ---
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
    // --
    setSelectedYear(year);
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
      width: 60,
    },
    {
      field: "player_name",
      headerName: "Player",
      displayName: "Player",
      width: 220,
      renderCell: (params) => <PlayerNameCell name={params.value} />,
    },
    {
      field: "player_age",
      headerName: "Age",
      displayName: "Age",
      width: 100,
      renderCell: (params) => {
        const age = params.value?.toString().split("-")[0] || "";
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography fontSize="0.9rem">{age}</Typography>
          </Box>
        );
      },
    },
    {
      field: "squad",
      headerName: "Squad",
      displayName: "Squad",
      width: 200,
      renderCell: (params) => <TeamBadgeCell squad={params.value} />,
    },
    {
      field: "position",
      headerName: "POS",
      displayName: "Position",
      width: 100,
      renderCell: (params) => <span>{params.value?.replace(/,/g, ", ")}</span>,
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
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: theme.palette.mode === "dark" ? "#26262A" : "#FAFAFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography fontSize="0.9rem">{params.value}</Typography>
        </Box>
      ),
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
  ];

  const rows = data?.map((row, i) => ({ id: i, ...row })) || [];

  const filteredRows = rows.filter((row) =>
    row.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CUSTOM STYLED PAGINATION
  const handlePageChange = (event, value) => setPage(value);
  const handlePageSizeChange = (event) => setPageSize(event.target.value);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // EXPORT
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

  // CUSTOM ARROW ICON
  const CustomArrowIcon = () => (
    <ArrowForwardIosIcon
      sx={{
        transform: "rotate(90deg)", // points down
        width: "1em",
        height: "1em",
        color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000"),
      }}
    />
  );

  return (
    <main style={{ padding: 24 }}>
      {/* Home Page */}
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
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
                  // exportToCSV(filteredRows, `schmetzer_scores_${season}.csv`)
                  exportToCSV(
                    filteredRows,
                    `schmetzer_scores_${selectedYear}.csv`
                  )
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
                <Suspense fallback={<div>Loading...</div>}>
                  {hardcodedYears.map((year) => (
                    <Button
                      key={year}
                      onClick={() => updateSeason(year)}
                      sx={baseButtonStyle(theme, selectedYear === year, true)}
                      // sx={baseButtonStyle(theme)}
                    >
                      {year}
                    </Button>
                  ))}
                </Suspense>

                <Suspense fallback={<div>Loading...</div>}>
                  <Box position="relative" width={44} height={40}>
                    <Select
                      // value={dropdownYears.includes(season) ? season : ""}
                      value={
                        dropdownYears.includes(selectedYear) ? selectedYear : ""
                      }
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
                </Suspense>
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
            {/* {dropdownYears.includes(season) && ( */}
            {dropdownYears.includes(selectedYear) && (
              <FilterChip
                label={selectedYear}
                // label={season}
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

          <Box mt={2} mb={4} sx={{ height: 450, width: "100%" }}>
            {isLoading ? (
              <Typography>Loading…</Typography>
            ) : (
              <DataGrid
                // rows={filteredRows}
                rows={paginatedRows}
                // columns={columns.filter(
                //   (col) => !hiddenColumns.includes(col.field)
                // )}
                columns={columns.filter(
                  (col) => !hiddenColumns.includes(col.field)
                )}
                loading={isLoading}
                onRowClick={(params) => setSelectedPlayer(params.row)}
                components={{
                  ColumnMenu: CustomColumnMenu,
                }}
                hideFooter
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

            {/* Custom Footer */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={4}
            >
              {/* Players by Page */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  fontFamily="'Bebas Neue', sans-serif"
                >
                  Players by Page
                </Typography>

                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  size="small"
                  IconComponent={(props) => (
                    <ArrowForwardIosIcon
                      {...props}
                      sx={{
                        transform: selectOpen
                          ? "rotate(-90deg)"
                          : "rotate(90deg)", // points down
                        width: "0.7em",
                        height: "0.7em",
                        color:
                          theme.palette.mode === "dark"
                            ? "black!important"
                            : "black",
                        pointerEvents: "none", // allow click to pass through to select
                        marginTop: "2px",
                      }}
                    />
                  )}
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
                          theme.palette.mode === "dark" ? "black" : "white",
                        border: `1px solid ${
                          theme.palette.mode === "dark" ? "white" : "black"
                        }`,
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.875rem",
                      },
                    },
                  }}
                  sx={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    height: "30px",
                    borderRadius: 0,
                    backgroundColor:
                      theme.palette.mode === "light" ? "white" : "black", // light: white, dark: black
                    color: theme.palette.mode === "dark" ? "black" : "black", // dark: white text
                    position: "relative",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        theme.palette.mode === "light" ? "black" : "white",
                      "&.Mui-focused": {
                        outline: "none",
                      },
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      position: "relative",
                      zIndex: 1,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      width: "100%",
                      height: "100%",
                      bgcolor: "#B7F08E",
                      borderRadius: 0,
                      zIndex: 0,
                      pointerEvents: "none", // ensure clicks pass through
                    },
                  }}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Pagination */}
              <StyledPagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
              />
            </Box>

            {/* <Box pb={5}>
              <Divider
                sx={{
                  my: "20px",
                  border: `1px solid ${
                    theme.palette.mode === "light" ? "black" : "white"
                  }`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === "dark" ? "#FAFAFA" : "#000",
                }}
              >
                Data Last Updated on August 31, 2025 at 9:00 PM EST
              </Typography>
            </Box> */}
            <LastUpdated />
          </Box>

          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
          >
            <Box
              sx={(theme) => ({
                width: 400,
                height: "100%",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#000" : "#FAFAFA",
                borderLeft: "4px solid #B7F08E",
                paddingTop: "50px",
                paddingX: "40px",
              })}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h3"
                  fontSize="1.25rem"
                  sx={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Filter Players
                </Typography>
                <IconButton
                  onClick={() => setFilterDrawerOpen(false)}
                  aria-label="close drawer"
                  size="small"
                >
                  <CloseIcon
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#fff" : "#000",
                    }}
                  />
                </IconButton>
              </Box>

              {/* Position */}
              <Typography variant="h4" fontSize="1rem" mb={-0.5}>
                Position
              </Typography>

              <CustomSelect
                value={filters.position}
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
                showPlaceholder={false}
                options={[
                  { value: "", label: "All Positions" },
                  { value: "FW", label: "Forward" },
                  { value: "MF", label: "Midfielder" },
                  { value: "DF", label: "Defender" },
                ]}
              />

              {/* Squad */}
              <Typography variant="h4" fontSize="1rem" mb={-0.5}>
                Squad
              </Typography>
              <TextField
                fullWidth
                value={filters.squad}
                onChange={(e) =>
                  setFilters({ ...filters, squad: e.target.value })
                }
                placeholder="Search for Squad"
                sx={(theme) => inputStyle(theme)}
              />

              {/* Minutes */}
              <Typography variant="h4" fontSize="1rem" mb={-0.5}>
                Minimum Minutes Played
              </Typography>
              <TextField
                fullWidth
                value={filters.minMinutes}
                onChange={(e) =>
                  setFilters({ ...filters, minMinutes: e.target.value })
                }
                placeholder="0"
                sx={(theme) => inputStyle(theme)}
              />

              {/* Buttons */}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFilters({ position: "", squad: "", minMinutes: "" })
                  }
                  sx={(theme) => ({
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    color: theme.palette.text.primary,
                    border: "none",
                    p: 0,
                    borderRadius: 0,
                  })}
                >
                  Clear All
                </Button>

                <Button
                  variant="contained"
                  sx={(theme) => ({
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#B7F08E" : "#3B5B84",
                    color: theme.palette.mode === "dark" ? "#000" : "#fff",
                    px: "40px",
                    py: "10px",
                    borderRadius: 0,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#A3DB79" : "#2F4D6E",
                    },
                  })}
                  onClick={() => {
                    // optional no-op since filter updates on change
                    setFilterDrawerOpen(false);
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </Drawer>

          <Dialog
            open={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            fullWidth
          >
            <DialogTitle>{selectedPlayer?.player_name}</DialogTitle>
            <DialogContent>
              {/* <Typography>Position: {selectedPlayer?.position}</Typography>
              <Typography>Squad: {selectedPlayer?.squad}</Typography>
              <Typography>Age: {selectedPlayer?.player_age}</Typography> */}
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
          <PlayerComparison
            currentYear={currentYear}
            selectedYear={selectedYear}
            updateSeason={updateSeason}
            players={players || []}
          />
        </Box>
      )}
    </main>
  );
}
