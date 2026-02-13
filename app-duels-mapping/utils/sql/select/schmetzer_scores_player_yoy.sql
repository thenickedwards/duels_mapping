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
    load_datetime
FROM schmetzer_scores_all
    WHERE {playerFilter}
    ORDER BY season;
