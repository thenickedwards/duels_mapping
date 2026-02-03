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
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlayerComparison from "./components/comparisons/PlayerComparison";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { saveAs } from "file-saver";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayerDetailDialog from "./components/players/PlayerDetailDialog";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import {
  baseButtonStyle,
  primaryActionButtonStyle,
} from "./styles/buttonStyles";
import FilterChip from "./styles/FilterChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import RightAlignedCenterCell from "./components/datagrid/RightAlignedCenterCell";
import CustomColumnMenu from "./components/datagrid/CustomColumnMenu";
import { inputStyle } from "./styles/inputStyles";
import CustomSelect from "./components/inputs/CustomSelect";
import PlayerNameCell from "./components/datagrid/PlayerNameCell";
import TeamBadgeCell from "./components/datagrid/TeamBadgeCell";
import LastUpdated from "./components/common/LastUpdated";
import PlayerSearchField from "./components/inputs/PlayerSearchField";
import PlayerFiltersRow from "./components/players/PlayerFiltersRow";
import PlayerYearControls from "./components/players/PlayerYearControls";
import SquadSelect from "./components/inputs/SquadSelect";
import { textActionButtonStyle } from "./styles/buttonStyles";

function removeAccents(str = "") {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(str = "") {
  return removeAccents(str) // strip accents/diacritics  (é → e)
    .toLowerCase()
    .replace(/\s+/g, ""); // remove all spaces
}

const fetcher = (url) => fetch(url).then((r) => r.json());

// Custom Styled Pagination
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    fontFamily: "'Bebas Neue', sans-serif",
    border: `1px solid ${
      theme.palette.mode === "light"
        ? theme.palette.common.black
        : "theme.palette.common.white"
    }`,
    color: theme.palette.text.primary,
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    color:
      theme.palette.mode === "light"
        ? theme.palette.common.black
        : theme.palette.common.black,
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
      backgroundColor: theme.palette.common.limegreen,
      zIndex: -1,
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    border: "none",
  },
}));

export default function PlayersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "players";

  // DATA YEARS

  const currentYear = new Date().getFullYear();

  // Update this when you add new data seasons
  const maxYearWithData = 2025;

  const seasonFromUrl = parseInt(
    searchParams.get("season") || currentYear.toString(),
    10
  );

  // Prevent defaulting to a year with no data
  const safeSeason = Math.min(seasonFromUrl, maxYearWithData);

  const [selectedYear, setSelectedYear] = useState(safeSeason.toString());

  const hardcodedYears = ["2025", "2024"];
  const dropdownYears = ["2023", "2022", "2021", "2020", "2019", "2018"];

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

  const { data: players } = useSWR(
    `/api/schmetzer_scores?season=${selectedYear}`,
    fetcher
  );

  const query = new URLSearchParams({ season: selectedYear.toString() });

  if (filters.position) query.set("position", filters.position);
  if (filters.minMinutes) query.set("minMinutes", filters.minMinutes);

  const { data, error, isLoading } = useSWR(
    `/api/schmetzer_scores?${query.toString()}`,
    fetcher
  );

  const updateSeason = (year) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("season", year);
    router.replace(`?${newParams.toString()}`);

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

  const rawRows = Array.isArray(data)
    ? data
    : Array.isArray(data?.rows)
    ? data.rows
    : Array.isArray(data?.players)
    ? data.players
    : [];

  const rows = rawRows.map((row, i) => ({ id: i, ...row }));

  const squadOptions = Array.from(
    new Set(rows.map((r) => r.squad).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const normalizedSearch = normalizeName(searchTerm);

  const filteredRows = rows.filter((row) => {
    if (!row) return false;

    // Search: player OR squad (accent-insensitive)
    const playerNameNormalized = normalizeName(row.player_name || "");
    const squadNormalized = normalizeName(row.squad || "");
    const matchesSearch =
      !normalizedSearch ||
      playerNameNormalized.includes(normalizedSearch) ||
      squadNormalized.includes(normalizedSearch);

    // Squad filter: if no squad selected, match all
    const matchesSquad = !filters.squad || row.squad === filters.squad;

    return matchesSearch && matchesSquad;
  });

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

  const filterCount = [
    filters.position,
    filters.squad,
    filters.minMinutes,
  ].filter(Boolean).length;

  // CUSTOM ARROW ICON (for page size select)
  const CustomArrowIcon = () => (
    <ArrowForwardIosIcon
      sx={{
        transform: "rotate(90deg)", // points down
        width: "1em",
        height: "1em",
        color: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.common.white
            : theme.palette.common.black,
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
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              transition: "background-color 0.15s ease",
              // Hover (inactive tabs only)
              "&:not(.Mui-selected):hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#26262A" : "#f2f2f2",
                boxShadow: `inset 0 -2px 0 ${
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black
                }`,
              },
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.common.limegreen
                  : theme.palette.common.blue,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.common.black
                  : theme.palette.common.white,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : "#324d70",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.black
                    : theme.palette.common.white,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.common.limegreen,
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
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.common.white
              : theme.palette.common.black,
          width: "100%",
          mt: "-2px",
        }}
      />

      {tab === "players" && (
        <>
          {/* Top controls: responsive layout */}
          <Box
            mt={3}
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            flexWrap={isMobile ? "nowrap" : "wrap"}
            justifyContent={isMobile ? "flex-start" : "space-between"}
            alignItems={isMobile ? "stretch" : "center"}
            gap={2}
          >
            {isMobile ? (
              <>
                {/* MOBILE: Search on top, full width, always expanded */}
                <Box width="100%" mb={"12px"}>
                  <PlayerSearchField
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    fullWidth
                  />
                </Box>

                {/* MOBILE: Filter / Columns / Export (no count) */}
                <PlayerFiltersRow
                  filters={filters}
                  onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
                  columns={columns}
                  hiddenColumns={hiddenColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                  setHiddenColumns={setHiddenColumns}
                  filteredRows={filteredRows}
                  selectedYear={selectedYear}
                  exportToCSV={exportToCSV}
                  showFilterCount={false}
                  baseButtonStyle={baseButtonStyle}
                />

                {/* MOBILE: Year controls on their own row */}
                <Box mt={1} mb={2}>
                  <PlayerYearControls
                    selectedYear={selectedYear}
                    updateSeason={updateSeason}
                    baseButtonStyle={baseButtonStyle}
                    hardcodedYears={hardcodedYears}
                    dropdownYears={dropdownYears}
                  />
                </Box>
              </>
            ) : (
              <>
                {/* DESKTOP: Left – Filter / Columns / Export (with count) */}
                <PlayerFiltersRow
                  filters={filters}
                  onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
                  columns={columns}
                  hiddenColumns={hiddenColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                  setHiddenColumns={setHiddenColumns}
                  filteredRows={filteredRows}
                  selectedYear={selectedYear}
                  exportToCSV={exportToCSV}
                  showFilterCount={true}
                  baseButtonStyle={baseButtonStyle}
                />

                {/* DESKTOP: Right – expandable search + year controls */}
                <Box display="flex" gap={1} alignItems="center">
                  {showSearch ? (
                    <ClickAwayListener onClickAway={() => setShowSearch(false)}>
                      <Box>
                        <PlayerSearchField
                          value={searchTerm}
                          onChange={setSearchTerm}
                          onClear={() => setSearchTerm("")}
                          autoFocus
                        />
                      </Box>
                    </ClickAwayListener>
                  ) : (
                    <IconButton onClick={() => setShowSearch(true)}>
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={{
                          fontSize: "18px",
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.common.white
                              : theme.palette.common.black,
                        }}
                      />
                    </IconButton>
                  )}

                  <PlayerYearControls
                    selectedYear={selectedYear}
                    updateSeason={updateSeason}
                    baseButtonStyle={baseButtonStyle}
                    hardcodedYears={hardcodedYears}
                    dropdownYears={dropdownYears}
                  />
                </Box>
              </>
            )}
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

            {filters.minMinutes && (
              <FilterChip
                label={`${filters.minMinutes} mins`}
                onRemove={() => setFilters({ ...filters, minMinutes: "" })}
              />
            )}

            {/* Dropdown Year Chip */}
            {dropdownYears.includes(selectedYear) && (
              <FilterChip
                label={selectedYear}
                onRemove={() => updateSeason("2025")}
              />
            )}

            {(filters.squad || filters.position || filters.minMinutes) && (
              <Box sx={{ px: "12px", alignContent: "center" }}>
                <Button
                  variant="text"
                  onClick={() =>
                    setFilters({ position: "", squad: "", minMinutes: "" })
                  }
                  sx={(theme) => textActionButtonStyle(theme)}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Box>

          <Box mt={2} mb={4} sx={{ height: 450, width: "100%" }}>
            {isLoading ? (
              <Typography>Loading…</Typography>
            ) : (
              <DataGrid
                rows={paginatedRows}
                columns={columns.filter(
                  (col) => !hiddenColumns.includes(col.field)
                )}
                loading={isLoading}
                onRowClick={(params) => setSelectedPlayer(params.row)}
                components={{
                  ColumnMenu: CustomColumnMenu,
                }}
                disableColumnFilter
                hideFooter
                sx={{
                  border: "none",

                  // HEADERS
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#26262A" : "#FAFAFA",
                    borderBottom: `2px solid ${
                      theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }`,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    "&:hover .MuiDataGrid-columnHeaderTitle": {
                      textDecoration: "underline 1px dashed",
                      textUnderlineOffset: "4px",
                      textDecorationColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.common.white
                          : theme.palette.common.black,
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
                    backgroundColor: theme.palette.common.limegreen,
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    color: `${theme.palette.common.black} !important`,
                    padding: "1px",
                    opacity: "1",
                  },

                  "& .MuiDataGrid-columnHeader:focus, \
                  & .MuiDataGrid-columnHeader:focus-within": {
                    outline: "none",
                  },

                  "& .MuiDataGrid-columnHeader .MuiButtonBase-root:focus": {
                    outline: "none",
                  },

                  "& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon:focus": {
                    outline: "none",
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
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  // Sort button (contains arrow)
                  "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
                    opacity: 0,
                    transition: "none",
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
                      transition: "none",
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
              mt={4}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent={isMobile ? "flex-start" : "space-between"}
              alignItems={isMobile ? "flex-start" : "center"}
              gap={isMobile ? 2 : 0}
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
                          : "rotate(90deg)",
                        width: "0.7em",
                        height: "0.7em",
                        color:
                          theme.palette.mode === "dark"
                            ? `${theme.palette.common.black} !important`
                            : theme.palette.common.black,
                        pointerEvents: "none",
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
                          theme.palette.mode === "dark"
                            ? theme.palette.common.black
                            : theme.palette.common.white,
                        border: `1px solid ${
                          theme.palette.mode === "dark"
                            ? theme.palette.common.white
                            : theme.palette.common.black
                        }`,
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.875rem",
                        "& .MuiMenuItem-root.Mui-selected": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.16)"
                              : "rgba(25,118,210,0.12)",
                        },
                      },
                    },
                  }}
                  sx={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    height: "30px",
                    borderRadius: 0,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.common.black
                        : theme.palette.common.black,
                    position: "relative",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        theme.palette.mode === "light"
                          ? theme.palette.common.black
                          : theme.palette.common.white,
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
                      bgcolor: theme.palette.common.limegreen,
                      borderRadius: 0,
                      zIndex: 0,
                      pointerEvents: "none",
                    },
                  }}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <MenuItem
                      key={size}
                      value={size}
                      sx={{
                        fontSize: "0.875rem",
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                    >
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Pagination */}
              <Box
                mt={isMobile ? 1 : 0}
                alignSelf={isMobile ? "flex-start" : "auto"}
              >
                <StyledPagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                />
              </Box>
            </Box>

            <LastUpdated />
          </Box>

          {/* Filter Drawer */}
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
                  theme.palette.mode === "dark"
                    ? theme.palette.common.black
                    : "#FAFAFA",
                borderLeft: `4px solid ${
                  theme.palette.mode === "dark"
                    ? theme.palette.common.limegreen
                    : theme.palette.common.white
                }`,
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
                        theme.palette.mode === "dark"
                          ? theme.palette.common.white
                          : theme.palette.common.black,
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

              <SquadSelect
                options={squadOptions}
                value={filters.squad}
                onChange={(value) => setFilters({ ...filters, squad: value })}
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
                  sx={(theme) => textActionButtonStyle(theme)}
                >
                  Clear All
                </Button>

                <Button
                  variant="contained"
                  sx={(theme) => primaryActionButtonStyle(theme)}
                  onClick={() => {
                    setFilterDrawerOpen(false);
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </Drawer>

          {/* Player Detail Dialog */}
          <Dialog
            open={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            fullWidth
          >
            <DialogTitle>{selectedPlayer?.player_name}</DialogTitle>
            <DialogContent>
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
