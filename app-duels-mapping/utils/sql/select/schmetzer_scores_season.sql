SELECT 
    player_name,
    player_nationality,
    position,
    squad,
    player_age,
    player_yob,
    nineties,
    schmetzer_score,
    schmetzer_rk,
    aerial_duels_won,
    aerial_duels_won_pts,
    aerial_duels_lost,
    aerial_duels_lost_pts,
    aerial_duels_total,
    aerial_duels_total_pts,
    aerial_duels_won_pct,
    tackles_won,
    tackles_won_pts,
    interceptions,
    interceptions_pts,
    recoveries,
    recoveries_pts
FROM "schmetzer_scores_{year}"
    "${whereClause}"
    ORDER BY schmetzer_score DESC;