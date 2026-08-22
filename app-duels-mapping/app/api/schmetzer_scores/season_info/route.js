export const runtime = "nodejs";
import { getDatabasePath, getSqlSelect } from "@/utils/db-utils";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { createClient } from "@supabase/supabase-js";
import {
  isLocalHost,
  MIN_NINETIES_FOR_AVERAGES,
} from "@/utils/request-context";
/*
The path for this API route is below.
Example when hosted locally:
http://localhost:3000/api/schmetzer_scores/season_info?season=2024
Note: the season query parameter is required (no other parameters are accepted).

The API response returned will be an array with one object containing the highest and average values for individual stats and the Schmetzer Score, a count of total players, and the distinct count of Schmetzer Score ranks for the requested season.

Only players with at least MIN_NINETIES_FOR_AVERAGES 90s (5 games' worth of minutes) are included, so a handful of cameo appearances cannot drag the league averages down. The SQLite template and the Supabase query below must apply the same floor -- see utils/request-context.js.
*/

// Hold the db instance across requests
let db = null;

/*
Schmetzer figures are served at 2 decimal places.

Weights such as -0.85 and 0.9 have no exact representation as binary floats, so a score
summed from them lands on values like 121.39999999999998, and an average over those
scores on 68.10745233968804. The stored scores are rounded by the scoring SQL, but an
average is computed at query time -- by SQLite here and by PostgREST on Supabase, where
it cannot be rounded server-side -- so both branches are normalized on the way out.
*/
const SMETZ_FIELDS = ["smetz_max", "smetz_avg"];

const roundSmetzFields = (rows) =>
  (rows ?? []).map((row) => {
    const rounded = { ...row };
    for (const field of SMETZ_FIELDS) {
      if (typeof rounded[field] === "number") {
        rounded[field] = Number(rounded[field].toFixed(2));
      }
    }
    return rounded;
  });

// GET handler for specific season Schmetzer scores
export async function GET(req) {
  const { searchParams, host } = new URL(req.url);

  const isLocal = isLocalHost(host);
  // const isLocal = false; // for testing Supabase connection
  const season = searchParams.get("season");

  if (!season) {
    return new Response(
      JSON.stringify({ error: "Missing 'season' parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Check if (!db) and running locally, open SQLite db, else use Supabase
    // SQLite connection
    if (isLocal) {
      console.log("Running locally, using SQLite DB");
      const dbPath = await getDatabasePath();
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      const sqlTemplate = await getSqlSelect(
        "schmetzer_scores_season_info.sql",
      );
      let sql = "";
      // Load and interpolate the SQL with the requested season and the shared
      // averages floor, so this and the Supabase branch below cannot diverge.
      sql = sqlTemplate
        .replace("{year}", season)
        .replaceAll("{min_nineties}", String(MIN_NINETIES_FOR_AVERAGES));

      const data = await db.all(sql);

      return new Response(JSON.stringify(roundSmetzFields(data)), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
      // Supabase connection
    } else {
      console.log("In deployment, using Supabase DB");
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
      );
      if (!supabase) console.log("Could NOT create Supabase client!");
      if (
        supabase.supabaseUrl == process.env.SUPABASE_URL &&
        supabase.supabaseKey == process.env.SUPABASE_ANON_KEY
      )
        console.log(
          "Created Supabase client matches SUPABASE_URL && SUPABASE_ANON_KEY!",
        );
      const table = `schmetzer_scores_${season}`;

      const { data, error } = await supabase
        .from(table)
        .select(
          `
          total_players:player_name.count(),
          total_ranks:schmetzer_rk.count(),
          adw_max:aerial_duels_won.max(),
          adw_avg:aerial_duels_won.avg(),
          tkw_max:tackles_won.max(),
          tkw_avg:tackles_won.avg(),
          int_max:interceptions.max(),
          int_avg:interceptions.avg(),
          recov_max:recoveries.max(),
          recov_avg:recoveries.avg(),
          adl_max:aerial_duels_lost.max(),
          adl_avg:aerial_duels_lost.avg(),
          smetz_max:schmetzer_score.max(),
          smetz_avg:schmetzer_score.avg()
          `,
        )
        .gte("nineties", MIN_NINETIES_FOR_AVERAGES);

      if (error) console.error(error);
      if (data) {
        console.log("Querying Supabase table:", table);
        console.log("Sample record: ", data[0]);
      }

      return new Response(JSON.stringify(roundSmetzFields(data)), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/* Example response below:
[
  {
    total_players: 577,
    total_ranks: 374,
    adw_max: 310,
    adw_avg: 19.150779896013866,
    tkw_max: 57,
    tkw_avg: 15.92894280762565,
    int_max: 57,
    int_avg: 14.616984402079723,
    recov_max: 243,
    recov_avg: 72.75736568457539,
    adl_max: 119,
    adl_avg: 19.084922010398614,
    smetz_max: 251.25,
    smetz_avg: 68.10745233968804,
  },
];
*/
