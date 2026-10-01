export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/*
Sends a Contact form submission to the site owner's inbox via Resend.

Talks to Resend's REST API with fetch rather than the resend package -- it is
one POST, and not worth a dependency.

Needs in app-duels-mapping/.env (and in Vercel for deploys):
  RESEND_API_KEY      -- from resend.com/api-keys
  CONTACT_TO_EMAIL    -- where messages land. Kept out of source so the
                         address is not scraped from the public repo.
  CONTACT_FROM_EMAIL  -- optional override. Until a domain is verified in
                         Resend, the sender must be an @resend.dev address, and
                         it only delivers to the Resend account's own address.

The visitor's address goes in reply_to, so replying from the inbox answers them.
*/

const DEFAULT_FROM = "Duels Mapping <duels-mapping@resend.dev>";
const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: the form hides this field from people, so anything in it came
  // from a bot. Report success so the bot has no signal to adapt to.
  if (body?.website) {
    return json({ ok: true });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return json({ error: "Name, email, and message are all required." }, 400);
  }
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL) {
    return json({ error: "That email address doesn't look right." }, 400);
  }
  if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return json({ error: "That message is too long." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL not set");
    return json({ error: "The contact form isn't set up yet." }, 500);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [to],
      reply_to: email,
      // Newlines in a header field are an injection vector; flatten the name.
      subject: `Duels Mapping contact: ${name.replace(/[\r\n]+/g, " ")}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend failed", res.status, await res.text());
    return json({ error: "Your message couldn't be sent. Please try again." }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
