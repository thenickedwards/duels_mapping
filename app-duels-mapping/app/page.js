import { Suspense } from "react";
import PlayersPageClient from "./PlayersPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayersPageClient />
    </Suspense>
  );
}

// POWERSYNC //
import { PowerSyncDatabase } from "@powersync/web";
import { Connector } from "./Connector";
import { AppSchema } from "./AppSchema";

export const db = new PowerSyncDatabase({
  // The schema you defined in the previous step
  schema: AppSchema,
  database: {
    // Filename for the SQLite database — it's important to only instantiate one instance per file.
    dbFilename: "mls_stats.db",
    // Optional. Directory where the database file is located.'
    // dbLocation: 'path/to/directory'
  },
});

export const setupPowerSync = async () => {
  // Uses the backend connector that will be created in the next section
  const connector = new Connector();
  db.connect(connector);
};
