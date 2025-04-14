DROP TABLE IF EXISTS raw_FBref_mls_players_all_stats_misc;

CREATE TABLE raw_FBref_mls_players_all_stats_misc (
    season         INTEGER  NOT NULL,
    player         TEXT     NOT NULL,
    nation         TEXT,
    pos            TEXT,
    squad          TEXT,
    age            TEXT,
    born           INTEGER,
    nineties       REAL, -- Renamed from '90s' (column names cannot start with a number)
    crdy           INTEGER DEFAULT 0,
    crdr           INTEGER DEFAULT 0,
    second_crdy    INTEGER DEFAULT 0, -- Renamed from '2crdy' to avoid leading number
    fls            INTEGER DEFAULT 0,
    fld            INTEGER DEFAULT 0,
    off            INTEGER DEFAULT 0,
    crs            INTEGER DEFAULT 0,
    intercept      INTEGER DEFAULT 0, -- More descriptive alias for 'int'
    tklw           INTEGER DEFAULT 0,
    pkwon          INTEGER DEFAULT 0,
    pkcon          INTEGER DEFAULT 0,
    og             INTEGER DEFAULT 0,
    recov          INTEGER DEFAULT 0,
    duels_won      INTEGER DEFAULT 0, -- More descriptive alias for 'won'
    duels_lost     INTEGER DEFAULT 0, -- More descriptive alias for 'lost'
    load_datetime  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
