import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";

/*
The path for this API route is below.
Example when hosted locally: 
http://localhost:3000/api/schmetzer_scores/season_info?season=2024
Note: the season query parameter is required (no other parameters are accepted).

The API response returned will be an array with one object containing the highest and average values for individual stats and the Schmetzer Score, a count of total players, and the distinct count of Schmetzer Score ranks for the requested season.
*/

// Hold the db instance across requests
let db = null;

// GET handler for specific season Schmetzer scores
export async function GET(req) {
  const { searchParams, host } = new URL(req.url);

  const season = searchParams.get("season");

  if (!season) {
    return new Response(
      JSON.stringify({ error: "Missing 'season' parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const filters = ["season = ?"];
  const values = [Number(season)];
  const sqlTemplate = await getSqlSelect("schmetzer_scores_season_info.sql");
  let sql = "";
  // Load and interpolate the SQL with the requested season
  sql = sqlTemplate.replace("{year}", season);
  // TODO: remove logs
  // console.log("filters passed: ", filters);
  // console.log("values passed: ", values);
  // console.log("sql passed: ", sql);

  try {
    // Check if (!db) and running locally, open SQLite db, else use Supabase
    const { type, client } = await getDbClient(host);

    if (type === "sqlite") {
      const result = await client.all(sql);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } else if (type === "supabase") {
      const table = `schmetzer_scores_${season}`;
      const { data, error } = await client
        .from(table)
        .select(
          `
          total_players:count(player_name),
          total_ranks:count.distinct(schmetzer_rk),
          adw_max:max(aerial_duels_won),
          adw_avg:avg(aerial_duels_won),
          tkw_max:max(tackles_won),
          tkw_avg:avg(tackles_won),
          int_max:max(interceptions),
          int_avg:avg(interceptions),
          recov_max:max(recoveries),
          recov_avg:avg(recoveries),
          adl_max:max(aerial_duels_lost),
          adl_avg:avg(aerial_duels_lost),
          smetz_max:max(schmetzer_score),
          smetz_avg:avg(schmetzer_score)  
        `
        )
        .gte("nineties", 1)
        .limit(1);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return new Response(JSON.stringify({ sql, values, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
