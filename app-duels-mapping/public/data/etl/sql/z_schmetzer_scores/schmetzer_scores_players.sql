DROP TABLE IF EXISTS "schmetzer_scores_{year}";

-- Create new table
CREATE TABLE "schmetzer_scores_{year}" (
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

-- Index for quicker lookup
CREATE INDEX IF NOT EXISTS idx_schmetzer_scores_{year}__player ON "schmetzer_scores_{year}" (player_name);

-- Insert data from staging table and compute Schmetzer Score
INSERT INTO "schmetzer_scores_{year}" (
    season,
    player_name,
    player_nationality,
    position,
    squad,
    player_age,
    player_yob,
    nineties,
    interceptions,
    interceptions_pts,
    tackles_won,
    tackles_won_pts,
    recoveries,
    recoveries_pts,
    aerial_duels_won,
    aerial_duels_won_pts,
    aerial_duels_lost,
    aerial_duels_lost_pts,
    aerial_duels_total,
    aerial_duels_total_pts,
    aerial_duels_won_pct,
    schmetzer_score
)
-- Trades create duplicate records for players (one per team).
-- In order to create one record per player, records are consolidated to the squad at which the player had more minutes (i.e. higher value in nineties)
WITH ranked_squads AS (
    SELECT *,
           RANK() OVER (
               PARTITION BY player_name
               ORDER BY nineties DESC
           ) AS squad_rank
    FROM stg_FBref_mls_players_all_stats_misc
    WHERE season = {year}
),
squad_agg_by_nineties AS (
    SELECT
        {year} AS season,
        player_name,
        MAX(player_nationality) AS player_nationality,  -- TODO: check for varinace (i.e. one time switch)
        MAX(position) AS position,
        -- Take the squad from row with most nineties
        MAX(CASE WHEN squad_rank = 1 THEN squad END) AS squad,
        MAX(player_age) AS player_age,
        MAX(player_yob) AS player_yob,
        SUM(nineties) AS nineties,
        SUM(interceptions) AS interceptions,
        SUM(tackles_won) AS tackles_won,
        SUM(recoveries) AS recoveries,
        SUM(aerial_duels_won) AS aerial_duels_won,
        SUM(aerial_duels_lost) AS aerial_duels_lost
    FROM ranked_squads
    GROUP BY player_name
)
-- 
SELECT
    season,
    player_name,
    player_nationality,
    position,
    squad,
    player_age,
    player_yob,
    nineties,
    interceptions,
    interceptions * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'interceptions'),
    tackles_won,
    tackles_won * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'tackles won'),
    recoveries,
    recoveries * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'recoveries'),
    aerial_duels_won,
    aerial_duels_won * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels won'),
    aerial_duels_lost,
    aerial_duels_lost * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels lost'),
    (aerial_duels_won + aerial_duels_lost), -- aerial_duels_total
    (aerial_duels_won * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels won')) +
    (aerial_duels_lost * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels lost')), -- aerial_duels_total_pts
    CASE
        WHEN (aerial_duels_won + aerial_duels_lost) = 0 THEN 0
        ELSE ROUND(100.0 * aerial_duels_won / (aerial_duels_won + aerial_duels_lost), 1) -- aerial_duels_won_pct
    END AS aerial_duels_won_pct,
    -- Calculate Schmetzer score
    (interceptions * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'interceptions')) +
    (tackles_won * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'tackles won')) +
    (recoveries * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'recoveries')) +
    (aerial_duels_won * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels won')) +
    (aerial_duels_lost * (SELECT point_value FROM dim_schmetzer_score_points WHERE stat_name = 'aerial duels lost'))
    AS schmetzer_score -- schmetzer_score
FROM squad_agg_by_nineties
WHERE season = {year}
ORDER BY schmetzer_score DESC;

WITH ranked AS (
    SELECT
        rowid AS original_rowid,
        RANK() OVER (ORDER BY schmetzer_score DESC) AS rk
    FROM schmetzer_scores_{year}
)
UPDATE schmetzer_scores_{year}
SET schmetzer_rk = (
    SELECT rk FROM ranked WHERE ranked.original_rowid = schmetzer_scores_{year}.rowid
);
