export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
/*
The Supabase keep-alive, ported from the supabase-watchdog repo so the schedule
lives with the deployed app instead of in a repo that has to stay busy to keep
its cron alive. GitHub disables scheduled workflows in a public repo after 60
days of no commits, which is what silently switched the watchdog off on
2026-07-16. Vercel Cron has no such rule. The watchdog repo is a fork, and a
fork cannot be made private, so moving the schedule here was the way out.

Triggered daily by Vercel Cron (see vercel.json). Vercel sends
`Authorization: Bearer $CRON_SECRET` when that env var is set, so the handler
rejects anything else -- the path is public and this table takes writes.

Writes with the service role key, not the anon key. Same reasoning as the ETL
sync: the anon key ships to every browser, so anything it can write, anyone can
write. See "Supabase write access" in the root README.

Manual run:
  curl -H "Authorization: Bearer $CRON_SECRET" https://duels-mapping.vercel.app/api/keep-alive
*/

const TABLE = "keep-alive";
const MAX_ENTRIES = 10; // rolling log -- trim the oldest once we exceed this

export async function GET(req) {
  if (
    process.env.CRON_SECRET &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return json({ error: "Unauthorized" }, 401);
  }

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key");
  }

  const supabase = createClient(process.env.SUPABASE_URL, key);

  try {
    // The insert is the point: a write is a much stronger activity signal than
    // a read-only ping, which is what people report Supabase no longer counts.
    const { error: insertError } = await supabase
      .from(TABLE)
      .insert({ name: randomBytes(5).toString("hex") });
    if (insertError) throw insertError;

    const { count, error: countError } = await supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true });
    if (countError) throw countError;

    let deleted = null;
    if (count > MAX_ENTRIES) {
      const { data: oldest, error: selectError } = await supabase
        .from(TABLE)
        .select("id, load_datetime")
        .order("load_datetime", { ascending: true })
        .limit(1);
      if (selectError) throw selectError;

      if (oldest?.length) {
        const { error: deleteError } = await supabase
          .from(TABLE)
          .delete()
          .eq("id", oldest[0].id);
        if (deleteError) throw deleteError;
        deleted = oldest[0].id;
      }
    }

    console.log(
      `Keep-alive ok. Entries: ${count}. Deleted: ${deleted ?? "none"}`,
    );
    return json({ ok: true, count, deleted });
  } catch (error) {
    // A non-200 is what makes the failure visible in the Vercel logs -- this is
    // the equivalent of the watchdog's sys.exit(1).
    console.error("Keep-alive failed:", error.message);
    return json({ ok: false, error: error.message }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
