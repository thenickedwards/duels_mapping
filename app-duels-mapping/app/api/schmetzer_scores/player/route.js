// export const runtime = "nodejs";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { createClient } from "@supabase/supabase-js";
/*
The path for this API route is below.
Example when hosted locally: 
http://localhost:3000/api/schmetzer_scores/player?season=2024&playerName=JordanMorris
Note: the season and playerName query parameters are required and should be passed to the URL with whitespace removed (as in the example above).

The API response returned will be an array with two arrays inside. The first array will have one object and will be that players stats for the requested season. The second array will have the year-over-year (YOY) schmetzer score and rank for the season. Both objects will include the player bio info.
*/

// Hold the db instance across requests
let db = null;

// GET handler for specific season Schmetzer scores
export async function GET(req, verbose = 2) {
  const { searchParams, host } = new URL(req.url);

  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  // const isLocal = false; // for testing Supabase connection
  const season = searchParams.get("season");
  const playerName = searchParams.get("playerName");

  if (verbose >= 2) console.log("season:", season, "playerName:", playerName);
  if (verbose >= 2)
    console.log(
      `Retrieving data for player ${playerName}; season: ${season} and Schmetzer Scores YOY`
    );

  if (!season) {
    return new Response(
      JSON.stringify({ error: "Missing 'season' parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!playerName) {
    return new Response(
      JSON.stringify({ error: "Missing 'playerName' parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const filters = ["season = ?", "REPLACE(LOWER(player_name), ' ', '') LIKE ?"];
  const values = [
    Number(season),
    `${playerName.toLowerCase().replace(/\s/g, "")}`,
  ];

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

      const playerSeasonSqlTemplate = await getSqlSelect(
        "schmetzer_scores_season.sql"
      );
      const playerYoySqlTemplate = await getSqlSelect(
        "schmetzer_scores_player_yoy.sql"
      );
      const whereClause = filters.length
        ? `WHERE ${filters.join(" AND ")}`
        : "";

      let playerSeasonSql = "";
      let playerYoySql = "";
      // Load and interpolate the SQL
      // Individual player scores from requested season
      playerSeasonSql = playerSeasonSqlTemplate
        .replace("{year}", season)
        .replace("{where_clause}", whereClause);
      if (verbose >= 2) console.log("playerSeasonSql: ", playerSeasonSql);
      // Individual player scores YOY
      playerYoySql = playerYoySqlTemplate.replace("{playerFilter}", filters[1]);
      if (verbose >= 2) console.log("playerYoySql: ", playerYoySql);

      const playerSeasonScores = await db.all(playerSeasonSql, values);
      const playerYoyScores = await db.all(playerYoySql, values[1]);

      // player scores from requested season and YOY to be returned
      const playerScores = [playerSeasonScores, playerYoyScores];
      if (verbose >= 2) console.log("playerScores: ", playerScores);

      return new Response(JSON.stringify(playerScores), {
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
      const playerNameNormalized = playerName.toLowerCase().replace(/\s/g, "");
      console.log(
        `Table: ${table}, Params: season=${season}, playerNameNormalized=${playerNameNormalized}`
      );
      // Query for player scores from requested season
      const { data: playerSeasonScores, error: playerSeasonScoresErr } =
        await supabase
          .from(table)
          .select(
            `id, player_name, player_nationality, position, squad, player_age, player_yob, nineties, schmetzer_score, schmetzer_rk, aerial_duels_won, aerial_duels_lost, aerial_duels_total, aerial_duels_won_pct, tackles_won, interceptions, recoveries`
          )
          .ilike("id", `${playerNameNormalized}%`);

      if (playerSeasonScores) {
        console.log("Querying Supabase table:", table);
        console.log("Record: ", playerSeasonScores);
      }

      if (playerSeasonScoresErr) console.error(playerSeasonScoresErr);

      // Query for player YOY scores
      const { data: playerYoyScores, error: playerYoyScoresErr } =
        await supabase
          .from("schmetzer_scores_all")
          .select(
            `season, player_name, player_nationality, position, squad, player_age, player_yob, nineties, schmetzer_score, schmetzer_rk`
          )
          .ilike("id", `${playerNameNormalized}%`)
          .order("season", { ascending: true });

      if (playerYoyScores) {
        console.log("Querying Supabase table:", table);
        console.log("Record: ", playerYoyScores);
      }

      if (playerYoyScoresErr) console.error(playerYoyScoresErr);

      // player scores from requested season and YOY to be returned
      const playerScores = [playerSeasonScores, playerYoyScores];
      if (verbose >= 2) console.log("playerScores: ", playerScores);

      return new Response(JSON.stringify(playerScores), {
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
