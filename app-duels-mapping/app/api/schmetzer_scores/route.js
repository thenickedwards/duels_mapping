// export const runtime = "nodejs";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { createClient } from "@supabase/supabase-js";
/*
The path for this API route is below.
Example when hosted locally: 
http://localhost:3000/api/schmetzer_scores?season=2024
Note: the season query parameter is required.

Other parameters are also accepted as optional including position, squad and minNineties (i.e. minimum number of minutes played divided by 90 -- roughly offers approximate time/games played over a season).
Example when hosted locally using all possible parameters: 
http://localhost:3000/api/schmetzer_scores?season=2024&position=MF&squad=SeattleSounders&minNineties=3

The API response returned will be an array with one object per player containing players stats for the requested season.
*/

// Hold the db instance across requests
let db = null;

// GET handler for specific season Schmetzer scores
export async function GET(req) {
  const { searchParams, host } = new URL(req.url);

  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const season = searchParams.get("season");
  const position = searchParams.get("position");
  const squad = searchParams.get("squad");
  const minNineties = searchParams.get("minNineties");

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

  if (position) {
    filters.push("REPLACE(LOWER(position), ' ', '') LIKE ?");
    values.push(`%${position.toLowerCase().replace(/\s/g, "")}%`);
  }

  if (squad) {
    filters.push("REPLACE(LOWER(squad), ' ', '') LIKE ?");
    values.push(`%${squad.toLowerCase().replace(/\s/g, "")}%`);
  }

  if (minNineties) {
    filters.push("nineties >= ?");
    values.push(Number(minNineties));
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const sqlTemplate = await getSqlSelect("schmetzer_scores_season.sql");
  let sql = "";
  // Load and interpolate the SQL with the requested season
  sql = sqlTemplate
    .replace("{year}", season)
    .replace("{where_clause}", whereClause);

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

      const data = await db.all(sql, values);

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
      id,
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
      aerial_duels_lost,
      aerial_duels_total,
      aerial_duels_won_pct,
      tackles_won,
      interceptions,
      recoveries
      `
        )
        .ilike("position", position ? `%${position}%` : "%")
        .ilike("squad", squad ? `%${squad}%` : "%")
        .gte("nineties", Number(minNineties) || 1)
        .order("schmetzer_score", { ascending: false });

      if (data) {
        console.log("Querying Supabase table:", table);
        console.log("Sample record: ", data[0]);
      }

      if (error) console.error(error);

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Database query error:", error, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
