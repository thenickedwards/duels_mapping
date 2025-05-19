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

  // Build query string
  const query = new URLSearchParams({ season });
  if (filters.position) query.set("position", filters.position);
  if (filters.squad) query.set("squad", filters.squad);
  if (filters.minMinutes) query.set("minMinutes", filters.minMinutes);

  // const { data, isLoading, error } = useSWR(`/api/schmetzer_scores?${query}`, fetcher);
  // *** REPLACE previous line when route.js and structure is updated. ***
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

  const columns = [
    { field: "schmetzer_rk", headerName: "Rk", width: 70 },
    { field: "player_name", headerName: "Player", width: 150 },
    { field: "player_age", headerName: "Age", width: 110 },
    { field: "squad", headerName: "Squad", flex: 1 },
    { field: "position", headerName: "POS", width: 90 },
  ];

  const rows = data?.map((row, i) => ({ id: i, ...row })) || [];

  return (
    <main style={{ padding: 24 }}>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Players" value="players" />
        <Tab label="Comparisons" value="comparisons" />
      </Tabs>

      {tab === "players" && (
        <>
          <Box mt={2} display="flex" gap={2} alignItems="center">
            <Typography variant="h6">Season:</Typography>

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
              value={["2023", "2022", "2021"].includes(season) ? season : ""}
              onChange={(e) => updateSeason(e.target.value)}
              displayEmpty
              IconComponent={ExpandMoreIcon}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="" disabled>
                More Years
              </MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
            </Select>

            <IconButton onClick={() => setFilterDrawerOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Box>

          <Box mt={2} sx={{ height: 450, width: "100%" }}>
            {isLoading ? (
              <Typography>Loading…</Typography>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
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
                <MenuItem value="Forward">Forward</MenuItem>
                <MenuItem value="Midfielder">Midfielder</MenuItem>
                <MenuItem value="Defender">Defender</MenuItem>
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
        </Box>
      )}
    </main>
  );
}
