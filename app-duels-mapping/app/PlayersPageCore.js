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
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import ToplineExplainer from "./components/common/ToplineExplainer";
import PlayerSearchField from "./components/inputs/PlayerSearchField";
import PlayerFiltersRow from "./components/players/PlayerFiltersRow";
import PlayerYearControls from "./components/players/PlayerYearControls";
import SquadSelect from "./components/inputs/SquadSelect";
import TuningDrawer from "./components/players/TuningDrawer";
import { textActionButtonStyle } from "./styles/buttonStyles";
import { formatSalary, formatValueMetric } from "@/utils/format-salary";
import {
  defaultWeightInputs,
  parseWeightInputs,
  retuneSeason,
  retuneSeasonStats,
  tunedWeightCount,
} from "@/utils/fine-tuning";
import {
  DEFAULT_SEASON,
  OUTFIELD_POSITIONS,
  buildViewQuery,
  describeView,
  isDefaultPositions,
  parseSeason,
  parseViewParams,
} from "@/utils/view-params";

function removeAccents(str = "") {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Sentinel page size meaning "show every player in one page"
const ALL_PLAYERS = -1;

// Shared by the drawer dropdown and the chips, so a chip reads "Midfielder" rather than
// the "MF" code stored on the row. These four are every position code the data holds --
// every other value is a combination of them, e.g. "MF,FW".
const POSITION_OPTIONS = [
  { value: "FW", label: "Forward" },
  { value: "MF", label: "Midfielder" },
  { value: "DF", label: "Defender" },
  { value: "GK", label: "Goalkeeper" },
];

// Goalkeepers are scored and ranked like everyone else, but they start deselected
// (OUTFIELD_POSITIONS): a keeper's Schmetzer Score is almost entirely recoveries (9,026
// of them league-wide against 104 tackles), so ranking them beside outfielders compares
// different jobs. They are one click away in the dropdown rather than removed. The
// outfield trio is the default view rather than a filter the user applied, so it raises
// no chips and does not count towards the Filters badge. Any other selection does.

// How long the minutes box waits after the last keystroke before it updates the URL
// (and with it the API query).
const MINUTES_DEBOUNCE_MS = 300;

function isMissing(value) {
  return value === null || value === undefined || value === "";
}

function compareValues(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
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
  const searchParams = useSearchParams();

  // SHAREABLE VIEW
  // Season, tab, filters and sort live in the query string and nowhere else, so a copied
  // link reopens the same view and Back/Forward can never leave the grid out of step
  // with the address bar. See utils/view-params.js for the format and validation.
  const searchString = searchParams.toString();
  const view = useMemo(
    () => parseViewParams(new URLSearchParams(searchString)),
    [searchString],
  );
  const { tab, season: selectedYear, sort } = view;
  // position and squad hold arrays so several can be compared at once; an empty
  // array means no filter. minMinutes stays a single value.
  const filters = useMemo(
    () => ({
      position: view.position,
      squad: view.squad,
      minMinutes: view.minMinutes,
    }),
    [view],
  );

  // replaceState rather than router.replace: Next keeps useSearchParams in step with it,
  // and it skips a server round trip for what is purely client-side state. Replace, not
  // push, so a burst of filter clicks does not fill up the Back button.
  const updateView = useCallback((changes) => {
    const current = parseViewParams(new URLSearchParams(window.location.search));
    const query = buildViewQuery({ ...current, ...changes });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, []);

  // generateMetadata titles the page a link opens on; keep the tab title in step as the
  // view changes here, since replaceState never goes back to the server.
  useEffect(() => {
    document.title = searchString
      ? `Duels Mapping | ${describeView(view)}`
      : "Duels Mapping";
  }, [view, searchString]);

  // DATA YEARS

  const currentYear = new Date().getFullYear();

  const hardcodedYears = ["2025", "2024"];
  const dropdownYears = ["2023", "2022", "2021", "2020", "2019", "2018"];

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // FINE TUNING
  // The drawer holds the raw strings the user typed so a half-entered "-0." survives
  // the next keystroke; the weights the scoring uses are parsed off them. Deliberately
  // component state and nothing more -- a tuned view is not written to the URL or to
  // storage, so a refresh returns everyone to the published weights.
  const [tuningDrawerOpen, setTuningDrawerOpen] = useState(false);
  const [weightInputs, setWeightInputs] = useState(defaultWeightInputs);
  const weights = useMemo(() => parseWeightInputs(weightInputs), [weightInputs]);
  const tunedCount = tunedWeightCount(weights);
  const isTuned = tunedCount > 0;

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showColumns, setShowColumns] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // A fresh array only when the sort itself changes, so the grid is not handed a new
  // model on every render.
  const sortModel = useMemo(() => (sort ? [sort] : []), [sort]);

  // Any change to what is listed sends the user back to page 1 -- otherwise a shared
  // link, or a narrower filter, can land on a page that no longer exists.
  const setFilters = (next) => {
    updateView(next);
    if ("minMinutes" in next) setMinutesDraft(next.minMinutes);
    setPage(1);
  };

  // The minutes box keeps its own draft so typing stays responsive, and only writes a
  // whole number to the URL once the user pauses. It follows the URL whenever that
  // changes underneath it (a chip removed, Clear All, a new link).
  const [minutesDraft, setMinutesDraft] = useState(filters.minMinutes);
  useEffect(() => setMinutesDraft(filters.minMinutes), [filters.minMinutes]);
  // Anything but digits (or an empty box) leaves the last good value in place rather
  // than wiping the filter over a typo.
  useEffect(() => {
    const trimmed = minutesDraft.trim();
    if (trimmed && !/^\d+$/.test(trimmed)) return;
    const cleaned = trimmed ? String(Number(trimmed) || "") : "";
    if (cleaned === filters.minMinutes) return;
    const timer = setTimeout(() => {
      updateView({ minMinutes: cleaned });
      setPage(1);
    }, MINUTES_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [minutesDraft, filters.minMinutes, updateView]);

  const [selectOpen, setSelectOpen] = useState(false);

  const { data: players } = useSWR(
    `/api/schmetzer_scores?season=${selectedYear}`,
    fetcher,
  );

  const query = new URLSearchParams({ season: selectedYear.toString() });

  // Position is filtered client-side below: the API matches a single value, and this
  // page already has every row for the season, so multi-select needs no round trip.
  if (filters.minMinutes) query.set("minMinutes", filters.minMinutes);

  const { data, error, isLoading } = useSWR(
    `/api/schmetzer_scores?${query.toString()}`,
    fetcher,
  );

  // Fetch season stats
  const { data: seasonStats } = useSWR(
    `/api/schmetzer_scores/season_info?season=${selectedYear}`,
    fetcher,
  );

  // Clamped like a URL value, so a caller passing the calendar year (Comparisons resets
  // to it) lands on the newest season with data rather than an empty one.
  const updateSeason = (year) => {
    updateView({ season: parseSeason(year) });
    setPage(1);
  };

  const handleTabChange = (_, newTab) => updateView({ tab: newTab });

  const toggleColumnVisibility = (field) => {
    setHiddenColumns((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
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
      field: "squad",
      headerName: "Squad",
      displayName: "Squad",
      // Fits the longest standardized names ("New England Revolution",
      // "Vancouver Whitecaps FC") alongside the badge without clipping
      width: 240,
      renderCell: (params) => <TeamBadgeCell squad={params.value} />,
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
    {
      field: "guaranteed_comp",
      headerName: "salary",
      displayName: "Salary (in Guaranteed Compensation)",
      width: 120,
      headerAlign: "right",
      renderCell: (params) => (
        <RightAlignedCenterCell
          value={formatSalary(params.value)}
          align="right"
        />
      ),
    },
    {
      field: "schmetzer_score_per_million",
      headerName: "smetz/$M",
      displayName: "Schmetzer Score per $1M",
      width: 120,
      headerAlign: "right",
      renderCell: (params) => (
        <RightAlignedCenterCell
          value={formatValueMetric(params.value)}
          align="right"
        />
      ),
    },
  ];

  // Counts chosen values rather than active filters -- two clubs and a position reads
  // as (3) -- and ignores the default outfield selection, which is the baseline view
  // rather than something the user asked for. Must agree with the chip row below.
  const activeFilterCount =
    (isDefaultPositions(filters.position) ? 0 : filters.position.length) +
    filters.squad.length +
    (filters.minMinutes ? 1 : 0);

  const rawRows = Array.isArray(data)
    ? data
    : Array.isArray(data?.rows)
      ? data.rows
      : Array.isArray(data?.players)
        ? data.players
        : [];

  // The whole season re-scored and re-ranked at the user's weights. It runs off the
  // unfiltered `players` fetch rather than `data`, because a rank is a season-wide
  // standing: ranking whatever the grid is currently showing would renumber the league
  // behind a minutes filter. Null while the weights are standard, so the untouched
  // case does no work and keeps the figures the warehouse served.
  const tunedSeason = useMemo(
    () =>
      isTuned && Array.isArray(players)
        ? retuneSeason(weights, players)
        : null,
    [isTuned, weights, players],
  );

  const tunedById = useMemo(
    () =>
      tunedSeason ? new Map(tunedSeason.map((row) => [row.id, row])) : null,
    [tunedSeason],
  );

  const rows = rawRows.map((row, i) => {
    const base = { id: i, ...row };
    const tuned = tunedById?.get(base.id);
    return tuned ? { ...base, ...tuned } : base;
  });

  // The dialog plots a score against the league average and maximum, so those move
  // with the weights too. Every other figure on seasonStats is a raw count.
  const tunedSeasonStats = useMemo(
    () =>
      tunedSeason ? retuneSeasonStats(seasonStats, tunedSeason) : seasonStats,
    [seasonStats, tunedSeason],
  );

  // Wait for rows to exist before accessing load_datetime from first record
  const lastUpdatedDate = rows.length > 0 ? rows[0].load_datetime : null;

  const squadOptions = Array.from(
    new Set(rows.map((r) => r.squad).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  // A link can name a club that is not in its season -- one that joined later, or a
  // hand-edited name. Drop those from the URL once the season's full list is in, rather
  // than filtering down to an empty table. Checked against the unfiltered fetch so a
  // minutes floor cannot knock out a club that is really there.
  useEffect(() => {
    if (!Array.isArray(players) || players.length === 0) return;
    const known = new Set(players.map((r) => r.squad));
    const valid = filters.squad.filter((name) => known.has(name));
    if (valid.length !== filters.squad.length) updateView({ squad: valid });
  }, [players, filters.squad, updateView]);

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

    // Squad and position: an empty selection matches everything, otherwise the row
    // has to match one of the chosen values.
    const matchesSquad =
      filters.squad.length === 0 || filters.squad.includes(row.squad);

    // A row's position can list more than one code ("MF,FW"), so a player shows up
    // under any of the positions they are listed at.
    const rowPositions = (row.position || "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean);
    const matchesPosition =
      filters.position.length === 0 ||
      filters.position.some((code) => rowPositions.includes(code));

    return matchesSearch && matchesSquad && matchesPosition;
  });

  // SORTING
  // The grid only ever receives one page of rows, so its own sorting would reorder that
  // page alone. Sort the whole filtered set here and hand the grid the slice it should
  // show, with sortingMode="server" so it does not sort again on top.
  const sortedRows = useMemo(() => {
    // With no sort of the user's own the API's own ordering stands -- except under
    // custom weights, which invalidate it. Re-apply the order the API would have
    // returned, or the rank column reads 1, 4, 2, 3 straight out of the drawer.
    const model = sortModel.length
      ? sortModel[0]
      : isTuned
        ? { field: "schmetzer_score", sort: "desc" }
        : null;
    if (!model) return filteredRows;
    const { field, sort } = model;
    if (!field || !sort) return filteredRows;
    const direction = sort === "desc" ? -1 : 1;
    return [...filteredRows].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      // Missing values sort last in BOTH directions -- the salary columns are empty for
      // any player the MLSPA release did not list, and a leaderboard sorted high-to-low
      // should not open with a screen of blanks. So this sits outside the direction flip.
      if (isMissing(aValue) || isMissing(bValue)) {
        if (isMissing(aValue) && isMissing(bValue)) return 0;
        return isMissing(aValue) ? 1 : -1;
      }
      return compareValues(aValue, bValue) * direction;
    });
  }, [filteredRows, sortModel, isTuned]);

  const handleSortModelChange = (model) => {
    updateView({ sort: model[0]?.sort ? model[0] : null });
    // Re-sorting reorders the whole list, so send the user back to its top
    setPage(1);
  };

  // CUSTOM STYLED PAGINATION
  const handlePageChange = (event, value) => setPage(value);
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const showingAll = pageSize === ALL_PLAYERS;
  const totalPages = showingAll ? 1 : Math.ceil(sortedRows.length / pageSize);
  const paginatedRows = showingAll
    ? sortedRows
    : sortedRows.slice((page - 1) * pageSize, page * pageSize);

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
          ].join(","),
        ),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  }

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
      <ToplineExplainer />
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
                  filterCount={activeFilterCount}
                  onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
                  onOpenTuningDrawer={() => setTuningDrawerOpen(true)}
                  tunedCount={tunedCount}
                  columns={columns}
                  hiddenColumns={hiddenColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                  setHiddenColumns={setHiddenColumns}
                  filteredRows={sortedRows}
                  selectedYear={selectedYear}
                  exportToCSV={exportToCSV}
                  showCounts={false}
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
                  filterCount={activeFilterCount}
                  onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
                  onOpenTuningDrawer={() => setTuningDrawerOpen(true)}
                  tunedCount={tunedCount}
                  columns={columns}
                  hiddenColumns={hiddenColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                  setHiddenColumns={setHiddenColumns}
                  filteredRows={sortedRows}
                  selectedYear={selectedYear}
                  exportToCSV={exportToCSV}
                  showCounts={true}
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
            {filters.squad.map((squad) => (
              <FilterChip
                key={squad}
                label={squad}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    squad: filters.squad.filter((s) => s !== squad),
                  })
                }
              />
            ))}

            {(isDefaultPositions(filters.position) ? [] : filters.position).map(
              (code) => (
                <FilterChip
                  key={code}
                  label={
                    POSITION_OPTIONS.find((opt) => opt.value === code)?.label ??
                    code
                  }
                  onRemove={() =>
                    setFilters({
                      ...filters,
                      position: filters.position.filter((p) => p !== code),
                    })
                  }
                />
              ),
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
                onRemove={() => updateSeason(DEFAULT_SEASON)}
              />
            )}

            {(filters.squad.length > 0 ||
              !isDefaultPositions(filters.position) ||
              filters.minMinutes) && (
              <Box sx={{ px: "12px", alignContent: "center" }}>
                <Button
                  variant="text"
                  onClick={() =>
                    setFilters({
                      position: OUTFIELD_POSITIONS,
                      squad: [],
                      minMinutes: "",
                    })
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
                  (col) => !hiddenColumns.includes(col.field),
                )}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                // Pagination is handled above, so the grid is told the rows it gets are
                // already the page. Without this it slices again on top of ours and caps
                // the view at its own 100-row page size, which "All" would silently hit.
                paginationMode="server"
                rowCount={sortedRows.length}
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
                  Players per Page
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
                  {[10, 25, 50, 100, ALL_PLAYERS].map((size) => (
                    <MenuItem
                      key={size}
                      value={size}
                      sx={{
                        fontSize: "0.875rem",
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                    >
                      {size === ALL_PLAYERS ? "All" : size}
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

            <LastUpdated lastUpdated={lastUpdatedDate} />
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
                onChange={(value) =>
                  setFilters({ ...filters, position: value })
                }
                placeholder="All Positions"
                options={POSITION_OPTIONS}
                summarize={(chosen) => {
                  if (chosen.length === POSITION_OPTIONS.length)
                    return "All Positions";
                  if (isDefaultPositions(chosen)) return "All outfield";
                  return null;
                }}
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
                value={minutesDraft}
                onChange={(e) => setMinutesDraft(e.target.value)}
                placeholder="0"
                sx={(theme) => inputStyle(theme)}
              />

              {/* Buttons */}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFilters({
                      position: OUTFIELD_POSITIONS,
                      squad: [],
                      minMinutes: "",
                    })
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

          {/* Fine Tuning Drawer */}
          <TuningDrawer
            open={tuningDrawerOpen}
            onClose={() => setTuningDrawerOpen(false)}
            weightInputs={weightInputs}
            onChangeWeight={(stat, value) =>
              setWeightInputs((prev) => ({ ...prev, [stat]: value }))
            }
            onReset={() => setWeightInputs(defaultWeightInputs())}
          />

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
                seasonStats={tunedSeasonStats}
                season={selectedYear}
                weights={weights}
                isTuned={isTuned}
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
            players={tunedSeason || players || []}
            lastUpdated={lastUpdatedDate}
          />
        </Box>
      )}
    </main>
  );
}
