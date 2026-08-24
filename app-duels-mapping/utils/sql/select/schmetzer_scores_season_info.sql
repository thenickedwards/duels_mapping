SELECT
	COUNT(player_name) as total_players,
	-- The denominator for "#rank of N" in the player dialog, so it has to be counted
	-- over the population the rank itself comes from: every player in the season, with
	-- no minutes floor. Hence the subquery -- the WHERE below applies to the averages
	-- only. Counting rows rather than DISTINCT schmetzer_rk, because ties share a rank
	-- and skip the next ones, so distinct ranks is smaller than the field a player was
	-- actually ranked against.
	(SELECT COUNT(*) FROM "schmetzer_scores_{year}") as total_ranks,
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
