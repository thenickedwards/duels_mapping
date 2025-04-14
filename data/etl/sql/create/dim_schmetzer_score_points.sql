DROP TABLE IF EXISTS dim_schmetzer_score_points;

CREATE TABLE dim_schmetzer_score_points (
        stat_name TEXT PRIMARY KEY,
        point_value REAL,
        abbrev TEXT
);