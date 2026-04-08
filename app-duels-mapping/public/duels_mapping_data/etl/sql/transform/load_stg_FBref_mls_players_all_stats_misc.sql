INSERT INTO stg_FBref_mls_players_all_stats_misc (
    season,
    player_name,
    player_nationality,
    position,
    squad,
    player_age,
    player_yob,
    nineties,
    yellow_cards1,
    red_cards,
    yellow_cards2,
    fouls_committed,
    fouls_drawn,
    offside,
    crosses,
    interceptions,
    tackles_won,
    pks_won,
    pks_con,
    own_goals,
    recoveries,
    aerial_duels_won,
    aerial_duels_lost,
    aerial_duels_total,
    aerial_duels_won_pct,
    load_datetime
)
SELECT
    raw.season,
    raw.player,
    raw.nation,
    raw.pos,
    raw.squad,
    raw.age,
    raw.born,
    raw.nineties,
    raw.crdy,
    raw.crdr,
    raw.second_crdy,
    raw.fls,
    raw.fld,
    raw.off,
    raw.crs,
    raw.intercept,
    raw.tklw,
    raw.pkwon,
    raw.pkcon,
    raw.og,
    raw.recov,
    raw.duels_won,
    raw.duels_lost,
    COALESCE(raw.duels_won, 0) + COALESCE(raw.duels_lost, 0) AS aerial_duels_total,
    CASE 
        WHEN (COALESCE(raw.duels_won, 0) + COALESCE(raw.duels_lost, 0)) > 0 
        THEN ROUND(1.0 * raw.duels_won / (raw.duels_won + raw.duels_lost), 3)
        ELSE 0.0
    END AS aerial_duels_won_pct,
    CURRENT_TIMESTAMP
FROM raw_FBref_mls_players_all_stats_misc raw
WHERE NOT EXISTS (
    SELECT 1
    FROM stg_FBref_mls_players_all_stats_misc stg
    WHERE stg.season = raw.season
      AND stg.player_name = raw.player
);
