INSERT INTO dim_schmetzer_score_points (stat_name, point_value, abbrev)
VALUES
    ('aerial duels won', 1, 'adw'),
    ('aerial duels lost', -0.75, 'adl'),
    ('tackles won', 1, 'tkwon'),
    ('interceptions', 0.75, 'int'),
    ('recoveries', 0.5, 'recov');


-- INSERT INTO dim_schmetzer_score_points (stat_name, point_value, abbrev)
-- VALUES
--     ('aerial duels won', :point_value, :abbrev),
--     ('aerial duels lost', :point_value, :abbrev),
--     ('tackles won', :point_value, :abbrev),
--     ('interceptions', :point_value, :abbrev),
--     ('recoveries', :point_value, :abbrev);