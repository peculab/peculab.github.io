# Taiwan–Seattle Bridge private file receiver

The public site is static GitHub Pages. It cannot write a shared JSON file when someone submits a form. This Worker stores each submitted registration as a **private R2 JSON object**, keyed by an HMAC of the normalized Email. The `/counts` endpoint lists only each object's role metadata and returns four totals. Names, Emails, and comments are never exposed by a public endpoint or committed to the website repository. R2 listing is strongly consistent, so a successful file write can be reflected by the next count read.

The browser sends the form to `/interest` first. After the private file is saved, it continues to the existing FormSubmit email flow. A failed save blocks that email submission so the visible count and recorded form remain consistent. Explicit `TEST` and `測試` entries are stored under `tests/` and omitted from the public count. Repeated submissions from the same Email update one registration file rather than incrementing the number of people.

## Deploy

1. In a Cloudflare account, create a private R2 bucket named `peculab-bridge-interest` and a Turnstile widget restricted to `peculab.github.io`. R2 public bucket access should stay disabled.
2. From this directory, run `npx wrangler login`, `npx wrangler secret put REGISTRY_HASH_KEY`, and `npx wrangler secret put TURNSTILE_SECRET`. `REGISTRY_HASH_KEY` should be a long random string; `TURNSTILE_SECRET` comes from the widget. Do not commit either secret.
3. Run `npx wrangler deploy`. Copy the resulting Worker URL and Turnstile **site key** into `bridge-config.js` at the repository root, then commit and push the website. The site key and Worker URL are public configuration, unlike the two secrets.
4. Submit one `TEST` entry from the **https** website. Confirm the FormSubmit email arrives and `/counts` stays at zero. Submit one genuine entry from a different Email and confirm `/counts` and the page rise by one. The screenshot of a prior `TEST` email is not imported automatically; the Worker counts submissions made after activation.

Until step 3 is complete, `bridge-config.js` stays empty and the current FormSubmit form plus manually reviewed `interest-counts.json` continue to work. This code has not been deployed because this workspace has no connected Cloudflare account or Worker credentials.

Cloudflare references: [R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/), [R2 consistency](https://developers.cloudflare.com/r2/reference/consistency/), [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
