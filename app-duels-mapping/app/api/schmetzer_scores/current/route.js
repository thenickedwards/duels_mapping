import sqlite3 from "sqlite3";
import { open } from "sqlite";
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

  // Get the current year
  const season = new Date().getFullYear();

  try {
    const scores = await db.all(`SELECT * FROM schmetzer_scores_${season}`);
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
