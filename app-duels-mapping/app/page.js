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
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ColumnsBlack from "./images/columns-icon.png";
import ColumnsWhite from "./images/columns-wh-icon.png";
import ExportBlack from "./images/export-icon.png";
import ExportWhite from "./images/export-wh-icon.png";

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
    { field: "schmetzer_rk", headerName: "rk", width: 70 },
    { field: "player_name", headerName: "Player", width: 150 },
    { field: "player_age", headerName: "Age", width: 110 },
    { field: "squad", headerName: "Squad", flex: 1 },
    { field: "position", headerName: "POS", width: 90 },
    { field: "nineties", headerName: "90s", width: 90 },
    { field: "schmetzer_score", headerName: "smetz", width: 90 },
    { field: "tackles_won", headerName: "tkw", width: 90 },
    { field: "interceptions", headerName: "int", width: 90 },
    { field: "recoveries", headerName: "recov", width: 90 },
    { field: "aerial_duels_won", headerName: "adw", width: 90 },
    { field: "aerial_duels_lost", headerName: "adl", width: 90 },
    { field: "aerial_duels_won_pct", headerName: "adw%", width: 90 },
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
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Players" value="players" />
        <Tab label="Comparisons" value="comparisons" />
      </Tabs>

      {tab === "players" && (
        <>
          <Box
            mt={2}
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
                      top={40}
                      left={0}
                      bgcolor="white"
                      border="1px solid #ccc"
                      borderRadius={1}
                      boxShadow={2}
                      zIndex={10}
                      p={1}
                    >
                      {columns.map((col) => (
                        <Box key={col.field}>
                          <label>
                            <input
                              type="checkbox"
                              checked={!hiddenColumns.includes(col.field)}
                              onChange={() => toggleColumnVisibility(col.field)}
                            />{" "}
                            {col.headerName}
                          </label>
                        </Box>
                      ))}
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
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: dropdownYears.includes(season)
                        ? theme.palette.mode === "dark"
                          ? "#000"
                          : "#fff"
                        : "transparent",
                      border: `1px solid ${
                        theme.palette.mode === "dark" ? "#fff" : "#000"
                      }`,
                      borderRadius: 0,
                      padding: 0,
                      "& .MuiSelect-select": {
                        padding: 0,
                        textIndent: "-9999px", // Hide the selected text
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "#f2f2f2",
                      },
                    }}
                    IconComponent={() => null} // Disable default icon
                  >
                    <MenuItem value="" disabled>
                      More
                    </MenuItem>
                    {dropdownYears.map((year) => (
                      <MenuItem key={year} value={year}>
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
              <FilterChip label={season} onRemove={() => updateSeason("2025")} />
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
