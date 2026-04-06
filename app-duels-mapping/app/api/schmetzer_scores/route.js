export const runtime = "nodejs";
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

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("192.168.");
  // const isLocal = false; // for testing Supabase connection
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
      },
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

      const sqlTemplate = await getSqlSelect("schmetzer_scores_season.sql");
      const whereClause = filters.length
        ? `WHERE ${filters.join(" AND ")}`
        : "";
      let sql = "";
      // Load and interpolate the SQL with the requested season
      sql = sqlTemplate
        .replace("{year}", season)
        .replace("{where_clause}", whereClause);

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
        process.env.SUPABASE_ANON_KEY,
      );
      if (!supabase) console.error("Could NOT create Supabase client!");
      if (
        supabase.supabaseUrl == process.env.SUPABASE_URL &&
        supabase.supabaseKey == process.env.SUPABASE_ANON_KEY
      )
        console.log("Created Supabase client successfully");
      const table = `schmetzer_scores_${season}`;

      const { data, error } = await supabase
        .from(table)
        .select(
          `id, player_name, player_nationality, position, squad, player_age, player_yob, nineties, schmetzer_score, schmetzer_rk, aerial_duels_won, aerial_duels_lost, aerial_duels_total, aerial_duels_won_pct, tackles_won, interceptions, recoveries, load_datetime`,
        )
        .ilike("position", position ? `%${position}%` : "%")
        .ilike("squad", squad ? `%${squad}%` : "%")
        .gte("nineties", Number(minNineties) || 1)
        .order("schmetzer_score", { ascending: false });

      if (error) console.error("Supabase error:", error);

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
    console.error("Database query error:", error, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/* Example response below:
[
   {
      "id":"cristianroldan-1995-2024-seattlesounders-usa",
      "player_name":"Cristian Roldan",
      "player_nationality":"USA",
      "position":"MF,FW",
      "squad":"Seattle Sounders",
      "player_age":28,
      "player_yob":1995,
      "nineties":31.5,
      "schmetzer_score":188.25,
      "schmetzer_rk":6,
      "aerial_duels_won":41,
      "aerial_duels_lost":29,
      "aerial_duels_total":70,
      "aerial_duels_won_pct":58.6,
      "tackles_won":45,
      "interceptions":24,
      "recoveries":212,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"obedvargas-2005-2024-seattlesounders-mex",
      "player_name":"Obed Vargas",
      "player_nationality":"MEX",
      "position":"MF,FW",
      "squad":"Seattle Sounders",
      "player_age":18,
      "player_yob":2005,
      "nineties":28.2,
      "schmetzer_score":134,
      "schmetzer_rk":53,
      "aerial_duels_won":12,
      "aerial_duels_lost":18,
      "aerial_duels_total":30,
      "aerial_duels_won_pct":40,
      "tackles_won":41,
      "interceptions":36,
      "recoveries":135,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"joãopaulomior-1991-2024-seattlesounders-bra",
      "player_name":"João Paulo Mior",
      "player_nationality":"BRA",
      "position":"MF",
      "squad":"Seattle Sounders",
      "player_age":32,
      "player_yob":1991,
      "nineties":14.2,
      "schmetzer_score":84.75,
      "schmetzer_rk":190,
      "aerial_duels_won":10,
      "aerial_duels_lost":13,
      "aerial_duels_total":23,
      "aerial_duels_won_pct":43.5,
      "tackles_won":15,
      "interceptions":28,
      "recoveries":97,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"joshuaatencio-2002-2024-seattlesounders-usa",
      "player_name":"Joshua Atencio",
      "player_nationality":"USA",
      "position":"MF",
      "squad":"Seattle Sounders",
      "player_age":22,
      "player_yob":2002,
      "nineties":11.9,
      "schmetzer_score":80.25,
      "schmetzer_rk":211,
      "aerial_duels_won":25,
      "aerial_duels_lost":28,
      "aerial_duels_total":53,
      "aerial_duels_won_pct":47.2,
      "tackles_won":19,
      "interceptions":25,
      "recoveries":77,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"albertrusnák-1994-2024-seattlesounders-svk",
      "player_name":"Albert Rusnák",
      "player_nationality":"SVK",
      "position":"MF",
      "squad":"Seattle Sounders",
      "player_age":29,
      "player_yob":1994,
      "nineties":28.1,
      "schmetzer_score":70.75,
      "schmetzer_rk":252,
      "aerial_duels_won":5,
      "aerial_duels_lost":15,
      "aerial_duels_total":20,
      "aerial_duels_won_pct":25,
      "tackles_won":11,
      "interceptions":18,
      "recoveries":105,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"léochú-2000-2024-seattlesounders-bra",
      "player_name":"Léo Chú",
      "player_nationality":"BRA",
      "position":"FW,MF",
      "squad":"Seattle Sounders",
      "player_age":23,
      "player_yob":2000,
      "nineties":7.9,
      "schmetzer_score":31.75,
      "schmetzer_rk":423,
      "aerial_duels_won":3,
      "aerial_duels_lost":3,
      "aerial_duels_total":6,
      "aerial_duels_won_pct":50,
      "tackles_won":10,
      "interceptions":4,
      "recoveries":36,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"pedrodelavega-2001-2024-seattlesounders-arg",
      "player_name":"Pedro De la Vega",
      "player_nationality":"ARG",
      "position":"FW,MF",
      "squad":"Seattle Sounders",
      "player_age":22,
      "player_yob":2001,
      "nineties":7.2,
      "schmetzer_score":27,
      "schmetzer_rk":463,
      "aerial_duels_won":2,
      "aerial_duels_lost":8,
      "aerial_duels_total":10,
      "aerial_duels_won_pct":20,
      "tackles_won":10,
      "interceptions":0,
      "recoveries":42,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"codybaker-2004-2024-seattlesounders-usa",
      "player_name":"Cody Baker",
      "player_nationality":"USA",
      "position":"DF,MF",
      "squad":"Seattle Sounders",
      "player_age":20,
      "player_yob":2004,
      "nineties":5.3,
      "schmetzer_score":25.75,
      "schmetzer_rk":479,
      "aerial_duels_won":4,
      "aerial_duels_lost":7,
      "aerial_duels_total":11,
      "aerial_duels_won_pct":36.4,
      "tackles_won":14,
      "interceptions":4,
      "recoveries":20,
      "load_datetime":"2025-10-23 22:22:34"
   },
   {
      "id":"danielmusovski-1995-2024-seattlesounders-usa",
      "player_name":"Daniel Musovski",
      "player_nationality":"USA",
      "position":"FW,MF",
      "squad":"Seattle Sounders",
      "player_age":28,
      "player_yob":1995,
      "nineties":5.7,
      "schmetzer_score":16.75,
      "schmetzer_rk":551,
      "aerial_duels_won":17,
      "aerial_duels_lost":24,
      "aerial_duels_total":41,
      "aerial_duels_won_pct":41.5,
      "tackles_won":7,
      "interceptions":1,
      "recoveries":20,
      "load_datetime":"2025-10-23 22:22:34"
   }
]
*/
