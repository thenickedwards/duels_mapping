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
  const relativePath = databasePathTemplate.replace(
    "_DATABASE_NAME_",
    databaseName
  );

  // Convert to absolute path using process.cwd()
  const absolutePath = path.join(process.cwd(), relativePath);

  // Optional: debug
  console.log("Resolved DB absolute path:", absolutePath);

  return absolutePath;
}
