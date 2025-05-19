import fs from "fs";
import path from "path";

// Resolves SQLite database path from data_vars JSON
export async function getDatabasePath(verbose = 2) {
  const dataVarsPath = path.join(
    process.cwd(),
    "public",
    "data",
    "data_vars.json"
  );
  const dataVars = JSON.parse(fs.readFileSync(dataVarsPath, "utf-8"));
  const dbName = dataVars.database.name;
  const dbPathTemplate = dataVars.database.path.replace(
    "app-duels-mapping/",
    ""
  );
  const relativePath = path.join(dbPathTemplate, dbName);

  // Log template and resolved relative path
  if (verbose >= 2) console.log("dbPathTemplate:", dbPathTemplate);
  if (verbose >= 2) console.log("relativePath:", relativePath);

  // Convert to absolute path using process.cwd()
  const absolutePath = path.resolve(relativePath);

  // Log the resolved absolute path
  if (!fs.existsSync(absolutePath) && verbose >= 1) {
    throw new Error(`Database file does not exist at ${absolutePath}`);
  }
  if (verbose >= 1) console.log("Resolved DB absolute path:", absolutePath);

  return absolutePath;
}

// Resolves path to SQL SELECT statements
export function getSqlSelect(sqlFile) {
  const sqlPath = path.join(process.cwd(), "utils", "sql", "select", sqlFile);
  const sql = fs.readFileSync(sqlPath, "utf-8");
  return sql;
}
