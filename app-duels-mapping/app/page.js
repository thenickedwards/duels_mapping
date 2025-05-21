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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PlayersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "players";
  const season = searchParams.get("season") || "2024";

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

  // Build query string
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
  
    const header = ['Index', ...Object.keys(data[0])];
    const csv = [header.join(',')].concat(
      data.map((row, i) => [i + 1, ...header.slice(1).map(field => JSON.stringify(row[field] || ''))].join(','))
    ).join('\n');
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }  

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
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(true)}
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
                startIcon={<FileDownloadIcon />}
                onClick={() =>
                  exportToCSV(filteredRows, `schmetzer_scores_${season}.csv`)
                }
              >
                Export
              </Button>
            </Box>

            {/* Right side controls */}
            <Box display="flex" gap={1} alignItems="center">
              {/* Expandable Search */}
              {showSearch ? (
                <TextField
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => setShowSearch(false)}
                  placeholder="Search Player"
                />
              ) : (
                <IconButton onClick={() => setShowSearch(true)}>
                  <span role="img" aria-label="Search">
                    🔍
                  </span>
                </IconButton>
              )}

              <Button
                variant={season === "2025" ? "contained" : "outlined"}
                onClick={() => updateSeason("2025")}
              >
                2025
              </Button>

              <Button
                variant={season === "2024" ? "contained" : "outlined"}
                onClick={() => updateSeason("2024")}
              >
                2024
              </Button>

              <Select
                value={
                  ["2023", "2022", "2021", "2020", "2019", "2018"].includes(
                    season
                  )
                    ? season
                    : ""
                }
                onChange={(e) => updateSeason(e.target.value)}
                displayEmpty
                IconComponent={ExpandMoreIcon}
                sx={{ minWidth: 50 }}
              >
                <MenuItem value="" disabled>
                  More
                </MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2023">2020</MenuItem>
                <MenuItem value="2022">2019</MenuItem>
                <MenuItem value="2021">2018</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Filter Chips Row */}
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {filters.squad && (
              <Button
                variant="outlined"
                onClick={() => setFilters({ ...filters, squad: "" })}
              >
                ✕ {filters.squad}
              </Button>
            )}
            {filters.position && (
              <Button
                variant="outlined"
                onClick={() => setFilters({ ...filters, position: "" })}
              >
                ✕ {filters.position}
              </Button>
            )}
            {(filters.squad || filters.position) && (
              <Button
                variant="text"
                onClick={() =>
                  setFilters({ position: "", squad: "", minMinutes: "" })
                }
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
            sx={{ p: 2 }}
          >
            <Box p={2} width={300}>
              <Typography variant="h6">Filter Players</Typography>
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
