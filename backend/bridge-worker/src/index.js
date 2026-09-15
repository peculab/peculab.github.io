const siteOrigin = "https://peculab.github.io";
const categories = { faculty: "faculty", institution: "institutions", student: "students", supporter: "supporters" };

function reply(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": origin === siteOrigin ? siteOrigin : "null",
      "vary": "Origin",
    },
  });
}

async function totals(bucket) {
  const result = { faculty: 0, institutions: 0, students: 0, supporters: 0, updated: new Date().toISOString().slice(0, 10) };
  let cursor;
  do {
    const page = await bucket.list({ prefix: "registrations/", cursor, include: ["customMetadata"] });
    for (const object of page.objects) {
      const category = categories[object.customMetadata?.role];
      if (category) result[category] += 1;
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return result;
}

async function fingerprint(secret, email) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email.trim().toLowerCase()));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function validateTurnstile(secret, token, ip) {
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true && result.hostname === "peculab.github.io";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const path = new URL(request.url).pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        "access-control-allow-origin": origin === siteOrigin ? siteOrigin : "null",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
        "vary": "Origin",
      } });
    }
    if (path === "/counts" && request.method === "GET") {
      return reply(await totals(env.INTEREST_FILES), 200, origin);
    }
    if (path !== "/interest" || request.method !== "POST") return reply({ error: "Not found" }, 404, origin);
    if (origin !== siteOrigin) return reply({ error: "Invalid origin" }, 403, origin);
    if (!env.REGISTRY_HASH_KEY || !env.TURNSTILE_SECRET) return reply({ error: "Worker is not configured" }, 503, origin);
    if (Number(request.headers.get("content-length") || 0) > 20000) return reply({ error: "Form too large" }, 413, origin);
    let data;
    try {
      const body = await request.text();
      if (body.length > 20000) return reply({ error: "Form too large" }, 413, origin);
      data = JSON.parse(body);
    } catch { return reply({ error: "Invalid JSON" }, 400, origin); }
    const role = String(data.role || "");
    const email = String(data.email || "").trim().toLowerCase();
    const name = String(data.name || "").trim();
    const organization = String(data.organization_location || "").trim();
    const interest = String(data.interest || "").trim();
    if (!categories[role] || !email.includes("@") || email.length > 254 || !name || !organization || !interest ||
        data.contact_consent !== "yes" || name.length > 200 || organization.length > 500 || interest.length > 5000) {
      return reply({ error: "Missing or invalid fields" }, 400, origin);
    }
    if (!await validateTurnstile(env.TURNSTILE_SECRET, String(data.turnstileToken || ""), request.headers.get("CF-Connecting-IP"))) {
      return reply({ error: "Verification failed" }, 403, origin);
    }
    const test = ["test", "測試"].includes(interest.toLowerCase());
    const id = await fingerprint(env.REGISTRY_HASH_KEY, email);
    const key = `${test ? "tests" : "registrations"}/${id}.json`;
    const record = { role, name, email, organization_location: organization, interest,
      timing_resources: String(data.timing_resources || "").slice(0, 5000), contact_consent: "yes",
      submitted_at: new Date().toISOString() };
    await env.INTEREST_FILES.put(key, JSON.stringify(record), {
      httpMetadata: { contentType: "application/json" }, customMetadata: { role },
    });
    return reply({ recorded: true, counted: !test, counts: await totals(env.INTEREST_FILES) }, 200, origin);
  },
};
