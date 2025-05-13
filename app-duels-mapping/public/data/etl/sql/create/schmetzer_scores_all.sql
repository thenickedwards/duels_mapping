DROP TABLE IF EXISTS "schmetzer_scores_all";

CREATE TABLE "schmetzer_scores_all" (
  season                  INTEGER  NOT NULL, 
  player_name             TEXT     NOT NULL,
  player_nationality      TEXT,
  position                TEXT,
  squad                   TEXT,
  player_age              INTEGER,
  player_yob              INTEGER,
  nineties                REAL,
  schmetzer_rk            INTEGER,
  schmetzer_score         REAL,
  aerial_duels_won        INTEGER DEFAULT 0,
  aerial_duels_won_pts    REAL DEFAULT 0, 
  aerial_duels_lost       INTEGER DEFAULT 0,
  aerial_duels_lost_pts   REAL DEFAULT 0, 
  aerial_duels_total      INTEGER DEFAULT 0,
  aerial_duels_total_pts  REAL DEFAULT 0, 
  aerial_duels_won_pct    REAL DEFAULT 0.0,
  tackles_won             INTEGER DEFAULT 0,
  tackles_won_pts         REAL DEFAULT 0, 
  interceptions           INTEGER DEFAULT 0,
  interceptions_pts       REAL DEFAULT 0, 
  recoveries              INTEGER DEFAULT 0,
  recoveries_pts          REAL DEFAULT 0, 
  load_datetime           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_schmetzer_scores_all__player ON schmetzer_scores_all (player_name);
CREATE INDEX IF NOT EXISTS idx_schmetzer_scores_all__season ON schmetzer_scores_all (season);
CREATE INDEX IF NOT EXISTS idx_schmetzer_scores_all__player_season ON schmetzer_scores_all (player_name, season);