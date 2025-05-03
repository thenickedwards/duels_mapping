DROP TABLE IF EXISTS "schmetzer_scores_all";

CREATE TABLE "schmetzer_scores_all" (
  season INTEGER,
  player_name TEXT,
  player_nationality TEXT,
  position TEXT,
  squad TEXT,
  player_age INTEGER,
  player_yob INTEGER,
  nineties REAL,
  schmetzer_score REAL,
  schmetzer_rk INTEGER,
  aerial_duels_won INTEGER,
  aerial_duels_won_pts REAL,
  aerial_duels_lost INTEGER,
  aerial_duels_lost_pts REAL,
  aerial_duels_total INTEGER,
  aerial_duels_total_pts REAL,
  aerial_duels_won_pct REAL,
  tackles_won INTEGER,
  tackles_won_pts REAL,
  interceptions INTEGER,
  interceptions_pts REAL,
  recoveries INTEGER,
  recoveries_pts REAL
);

-- Indexes for fast querying
CREATE INDEX idx_player ON schmetzer_scores_all (player_name);
CREATE INDEX idx_season ON schmetzer_scores_all (season);
CREATE INDEX idx_player_season ON schmetzer_scores_all (player_name, season);