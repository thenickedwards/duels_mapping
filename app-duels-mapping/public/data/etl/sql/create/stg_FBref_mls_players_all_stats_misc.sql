DROP TABLE IF EXISTS stg_FBref_mls_players_all_stats_misc;

CREATE TABLE stg_FBref_mls_players_all_stats_misc (
    season                  INTEGER  NOT NULL,
    player_name             TEXT     NOT NULL,
    player_nationality      TEXT,
    position                TEXT,
    squad                   TEXT,
    player_age              INTEGER,
    player_yob              INTEGER,
    nineties                REAL,
    yellow_cards1           INTEGER DEFAULT 0,
    red_cards               INTEGER DEFAULT 0,
    yellow_cards2           INTEGER DEFAULT 0,
    fouls_committed         INTEGER DEFAULT 0,
    fouls_drawn             INTEGER DEFAULT 0,
    offside                 INTEGER DEFAULT 0,
    crosses                 INTEGER DEFAULT 0,
    interceptions           INTEGER DEFAULT 0,
    tackles_won             INTEGER DEFAULT 0,
    pks_won                 INTEGER DEFAULT 0,
    pks_con                 INTEGER DEFAULT 0,
    own_goals               INTEGER DEFAULT 0,
    recoveries              INTEGER DEFAULT 0,
    aerial_duels_won        INTEGER DEFAULT 0,
    aerial_duels_lost       INTEGER DEFAULT 0,
    aerial_duels_total      INTEGER DEFAULT 0, -- New column since raw
    aerial_duels_won_pct    REAL DEFAULT 0.0, -- New column since raw
    load_datetime           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- , UNIQUE(player_name, player_yob, season, squad)
);

CREATE INDEX IF NOT EXISTS idx_stg_season__player
    ON stg_FBref_mls_players_all_stats_misc (season, player_name);
