import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";

// Hold the db instance across requests
let db = null;

// GET handler for specific season Schmetzer scores
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const season = searchParams.get("season");
  const playerName = searchParams.get("playerName");

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

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  if (!db) {
    const dbPath = await getDatabasePath();
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  const playerSeasonSqlTemplate = await getSqlSelect(
    "schmetzer_scores_season.sql"
  );
  const playerYoySqlTemplate = await getSqlSelect(
    "schmetzer_scores_player_yoy.sql"
  );
  // console.log("playerSeasonSqlTemplate: ", playerSeasonSqlTemplate);
  // console.log("playerYoySqlTemplate: ", playerYoySqlTemplate);

  try {
    // Load and interpolate the SQL
    // Individual player scores from requested season
    const playerSeasonSql = playerSeasonSqlTemplate
      .replace("{year}", season)
      .replace("{where_clause}", whereClause);
    console.log("playerSeasonSql: ", playerSeasonSql);
    const playerSeasonScores = await db.all(playerSeasonSql, values);

    // Individual player scores YOY
    const playerYoySql = playerYoySqlTemplate.replace(
      "{playerFilter}",
      filters[1]
    );
    console.log("playerYoySql: ", playerYoySql);
    const playerYoyScores = await db.all(playerYoySql, [values[1]]);

    // player scores from requested season and YOU to be returned
    const playerScores = [playerSeasonScores, playerYoyScores];

    return new Response(JSON.stringify(playerScores), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Database query error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
