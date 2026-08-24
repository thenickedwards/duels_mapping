SELECT 
    season, 
    player_name, 
    player_nationality,
    position,
    squad,
    player_age,
    player_yob,
    nineties,
    schmetzer_score, 
    schmetzer_rk,
    -- Raw counts travel with the score so the player dialog can re-score past seasons
    -- at custom weights when the Fine Tuning drawer is off its defaults.
    aerial_duels_won,
    aerial_duels_lost,
    tackles_won,
    interceptions,
    recoveries,
    load_datetime
FROM schmetzer_scores_all
    WHERE {playerFilter}
    ORDER BY season;
