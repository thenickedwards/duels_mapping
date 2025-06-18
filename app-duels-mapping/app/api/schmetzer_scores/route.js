// export const runtime = "nodejs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";

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
  const { searchParams } = new URL(req.url);

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

  if (!db) {
    const dbPath = await getDatabasePath();
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  const sqlTemplate = await getSqlSelect("schmetzer_scores_season.sql");

  let sql = "";

  try {
    // Load and interpolate the SQL with the requested season
    sql = sqlTemplate
      .replace("{year}", season)
      .replace("{where_clause}", whereClause);
    // TODO: remove logs
    // console.log("filters passed: ", filters);
    // console.log("values passed: ", values);
    // console.log("sql passed: ", sql);

    const scores = await db.all(sql, values);

    return new Response(JSON.stringify(scores), {
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
