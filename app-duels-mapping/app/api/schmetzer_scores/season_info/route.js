import sqlite3 from "sqlite3";
import { open } from "sqlite";
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
  const { searchParams } = new URL(req.url);

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

  if (!db) {
    const dbPath = await getDatabasePath();
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  const sqlTemplate = await getSqlSelect("schmetzer_scores_season_info.sql");

  let sql = "";

  try {
    // Load and interpolate the SQL with the requested season
    sql = sqlTemplate.replace("{year}", season);
    // TODO: remove logs
    // console.log("filters passed: ", filters);
    // console.log("values passed: ", values);
    // console.log("sql passed: ", sql);

    const season_info = await db.all(sql);

    return new Response(JSON.stringify(season_info), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Database query error:", error.message);
    return new Response(JSON.stringify({ sql, values, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
