export const runtime = "nodejs";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { createClient } from "@supabase/supabase-js";
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

  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  // const isLocal = false; // for testing Supabase connection
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

  try {
    // Check if (!db) and running locally, open SQLite db, else use Supabase
    // SQLite connection
    if (isLocal) {
      console.log("Running locally, using SQLite DB");
      const dbPath = await getDatabasePath();
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      const sqlTemplate = await getSqlSelect(
        "schmetzer_scores_season_info.sql"
      );
      let sql = "";
      // Load and interpolate the SQL with the requested season
      sql = sqlTemplate.replace("{year}", season);

      const data = await db.all(sql);

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
      // Supabase connection
    } else {
      console.log("In deployment, using Supabase DB");
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      if (!supabase) console.log("Could NOT create Supabase client!");
      if (
        supabase.supabaseUrl == process.env.SUPABASE_URL &&
        supabase.supabaseKey == process.env.SUPABASE_ANON_KEY
      )
        console.log(
          "Created Supabase client matches SUPABASE_URL && SUPABASE_ANON_KEY!"
        );
      const table = `schmetzer_scores_${season}`;

      const { data, error } = await supabase
        .from(table)
        .select(
          `
          total_players:player_name.count(),
          total_ranks:schmetzer_rk.count(),
          adw_max:aerial_duels_won.max(),
          adw_avg:aerial_duels_won.avg(),
          tkw_max:tackles_won.max(),
          tkw_avg:tackles_won.avg(),
          int_max:interceptions.max(),
          int_avg:interceptions.avg(),
          recov_max:recoveries.max(),
          recov_avg:recoveries.avg(),
          adl_max:aerial_duels_lost.max(),
          adl_avg:aerial_duels_lost.avg(),
          smetz_max:schmetzer_score.max(),
          smetz_avg:schmetzer_score.avg()
          `
        )
        .gte("nineties", 1);

      if (error) console.error(error);
      if (data) {
        console.log("Querying Supabase table:", table);
        console.log("Sample record: ", data[0]);
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
