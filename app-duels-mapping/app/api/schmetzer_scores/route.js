import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";

// Hold the db instance across requests
let db = null;

// GET handler for specific season Schmetzer scores
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const season = searchParams.get("season");
  const position = searchParams.get("position");
  const squad = searchParams.get("squad");
  const minMinutes = searchParams.get("minMinutes");

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
  const values = [season];

  if (position) {
    filters.push("position = ?");
    values.push(position);
  }

  if (squad) {
    filters.push("LOWER(squad) LIKE ?");
    values.push(`%${squad.toLowerCase()}%`);
  }

  if (minMinutes) {
    filters.push("minutes_played >= ?");
    values.push(Number(minMinutes));
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

  try {
    // Load and interpolate the SQL with the requested season
    const sql = sqlTemplate
      .replace("{year}", season)
      .replace("{where_clause}", whereClause);

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
