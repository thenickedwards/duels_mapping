import fs from "fs";
import path from "path";

// Resolves the SQLite database path from data_vars JSON
export async function getDatabasePath() {
  const dataVarsPath = path.join(
    process.cwd(),
    "public",
    "data",
    "data_vars.json"
  );
  const dataVars = JSON.parse(fs.readFileSync(dataVarsPath, "utf-8"));
  const dbName = dataVars.database.name;
  const dbPathTemplate = dataVars.database.path;
  const relativePath = dbPathTemplate.replace("_DATABASE_NAME_", dbName);

  // Convert to absolute path using process.cwd()
  const absolutePath = path.join(process.cwd(), relativePath);

  // Log the resolved absolute path
  // console.log("Resolved DB absolute path:", absolutePath);

  return absolutePath;
}

export async function getSqlSelect(sqlFile) {
  const sqlPath = path.join(process.cwd(), "utils", "sql", "select", sqlFile);
  const sql = fs.readFileSync(sqlPath, "utf-8");
  return sql;
}
