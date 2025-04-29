import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { getDatabasePath } from "@/utils/db-utils";

// Hold the db instance across requests
let db = null;

// GET handler for current season Schmetzer scores
export async function GET() {
  if (!db) {
    const dbPath = await getDatabasePath();
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  const sqlPath = path.join(
    process.cwd(),
    "utils",
    "sql",
    "select",
    "schmetzer_scores_season.sql"
  );

  // Get the current year
  const season = new Date().getFullYear();

  try {
    // Read and prepare SQL string
    let sql = fs.readFileSync(sqlPath, "utf-8");
    sql = sql.replace("{year}", season); // Replace placeholder

    // Execute SQL
    const scores = await db.all(sql);

    return new Response(JSON.stringify(scores), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Database query error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
