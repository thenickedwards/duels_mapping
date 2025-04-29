export const runtime = "nodejs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

let db = null;

async function getDatabasePath() {
  const configPath = path.join(
    process.cwd(),
    "public",
    "data",
    "data_vars.json"
  );
  const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const databaseName = configData.database.name;
  const databasePathTemplate = configData.database.path;
  const resolvedDatabasePath = path.join(
    "public",
    databasePathTemplate.replace("_DATABASE_NAME_", databaseName)
  );
  return resolvedDatabasePath;
}

export async function GET() {
  if (!db) {
    const dbPath = await getDatabasePath();
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  try {
    const scores = await db.all("SELECT * FROM schmetzer_scores_2025");
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
