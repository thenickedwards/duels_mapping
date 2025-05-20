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
    schmetzer_rk
FROM schmetzer_scores_all
    WHERE player_name = '{player_name}'
    ORDER BY season;
