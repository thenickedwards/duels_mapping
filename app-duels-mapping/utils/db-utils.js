import fs from "fs";
import path from "path";

// Resolves the SQLite database path from JSON config
export async function getDatabasePath() {
  const configPath = path.join(
    process.cwd(),
    "public",
    "data",
    "data_vars.json"
  );
  const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const databaseName = configData.database.name;
  const databasePathTemplate = configData.database.path;
  return path.join(
    "public",
    databasePathTemplate.replace("_DATABASE_NAME_", databaseName)
  );
}
