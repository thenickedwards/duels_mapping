const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Load and parse the config JSON
const configPath = path.join(__dirname, "public", "data", "data_vars.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Extract database path and name
const databaseDir = config.database.path;
const databaseName = config.database.name;

// Build the full absolute path to the database
const fullDbPath = path.join(__dirname, databaseDir, databaseName);

// Connect to SQLite database in read-only mode
const db = new sqlite3.Database(fullDbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    return console.error("❌ Error opening database:", err.message);
  } else {
    console.log(`✅ Opened SQLite database ${databaseName} successfully.`);
  }
});

module.exports = db;
