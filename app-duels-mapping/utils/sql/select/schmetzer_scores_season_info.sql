SELECT 
	COUNT(player_name) as total_players,
	COUNT(DISTINCT(schmetzer_rk)) as total_ranks,
	MAX(aerial_duels_won) as adw_max,
	AVG(aerial_duels_won) as adw_avg,
	MAX(tackles_won) as tkw_max,
	AVG(tackles_won) as tkw_avg,
	MAX(interceptions) as int_max,
	AVG(interceptions) as int_avg,
	MAX(recoveries) as recov_max,
	AVG(recoveries) as recov_avg,
	MAX(aerial_duels_lost) as adl_max,
	AVG(aerial_duels_lost) as adl_avg,
	MAX(schmetzer_score) as smetz_max,
	AVG(schmetzer_score) as smetz_avg
FROM "schmetzer_scores_{year}"
	-- Season averages exclude players below {min_nineties} 90s (see
	-- utils/request-context.js). They are still scored and ranked on the
	-- leaderboard; they are just kept out of the league mean.
	WHERE nineties >= {min_nineties};