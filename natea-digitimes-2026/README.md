# Seattle Technology & Industry Forum 2026

The English event page for **AI, Semiconductors & Global Supply Chains: A Conversation with Colley Hwang**, scheduled for December 12, 2026 in Greater Seattle. NATEA Seattle organizes the event. NSF A3D3 Institute co-organizes it, DIGITIMES is the featured speaker organization, and PecuLab is an event partner.

## Files and local preview

- `index.html` contains the full public page, fallback content, and crawler-readable metadata.
- `styles.css` contains the responsive layout and visual styles.
- `config.js` contains the event, organizations, registration controls, agenda, and analytics settings.
- `app.js` applies confirmed settings and adds registration gates, sharing, and analytics hooks.
- `assets/icons/forum.svg` is the favicon.
- `assets/social/og-event-draft.png` is an organizer-review draft.
- The local portrait at `assets/speakers/colley-hwang.jpg` is from the [DIGITIMES D Forum speaker page](https://www.digitimes.com.tw/seminar/DForum_20240319/). Add approved organization assets under `assets/logos/`.
- [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) tracks review and launch.

From the PecuLab repository root, run:

```sh
python -m http.server 8000
```

If Python is unavailable, use Node.js from the same directory:

```powershell
node -e "const h=require('http'),f=require('fs'),p=require('path'),d='/natea-digitimes-2026/';h.createServer((q,r)=>{let u=new URL(q.url,'http://localhost').pathname;if(u===d)u+='index.html';if((!u.startsWith(d)&&u!=='/assets/peculab-mark-clean.png')||u.includes('%')||u.includes('..'))return r.writeHead(404).end();f.readFile(p.join('.',u),(e,b)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'}[p.extname(u)]||'text/plain');r.end(b)})}).listen(8000,'127.0.0.1')"
```

Preview at [localhost](http://localhost:8000/natea-digitimes-2026/). No build step is required for local preview.

## Configuration and release

| Change | Fields and files |
| --- | --- |
| Date and venue | Set `date` as YYYY-MM-DD and local `time`/`endTime` as HH:mm. Set `timezone`, `region`, `venueName`, `venueAddress` and `venueMapUrl` once confirmed. Capacity is tracked for organizer reference and enforced in Zeffy. |
| Pricing and enrollment | Update `pricing`, `membership.year`, membership dates and `membershipEnrollmentEnabled`. Match the Zeffy campaigns and static fallback in `index.html`. |
| Registration | Set `registrationEnabled: true` and `registrationStatus: "open"` only after launch approval and campaign checks. A deliberate site update is required when Zeffy availability changes. Supported statuses are `coming-soon`, `open`, `sold-out`, `closed`, `completed`, and `cancelled`. |
| Member tickets | Set the individual eligibility flags and `memberTicketVerified: true` after the organizer tests redemption. Purchase and redemption links appear only while registration is open. |
| Contacts and policies | Set `organizerContactEmail`, `accessibilityContact`, and the approved `refundPolicy`. |
| Speaker | Set `speaker.title`, `speaker.biography`, and `speaker.photo` with approved copy and a local asset path. Use the text layout until a portrait is approved. |
| Schedule | Update `AGENDA` and mirror it in the static markup. Add start times only for confirmed items. |
| Partners | Add a confirmed organization to `ORGANIZATIONS` with `id`, `name`, `role`, `website`, `description`, and `displayOrder`. Set `logoApproved` and a local logo path after receiving approval. Mirror confirmed cards in static HTML for visitors without JavaScript. |

Synchronize edited facts in `index.html`, including static date and prices, fallback registration controls, page title, canonical, descriptions, and share destinations. The static page also links to paid tickets. For every availability change, update the static links and status copy so visitors without JavaScript see the same availability. The static page also exposes code redemption while the discount-code workflow is active. Hide redemption links and member benefit copy in the static page if the workflow is paused. Keep member enrollment’s static URL and its visibility aligned separately. Add Event JSON-LD once verified event timing and venue are available. Include only confirmed values.

### Logo and social assets

| Organization | Asset and approval |
| --- | --- |
| PecuLab | The existing homepage image `../assets/peculab-mark-clean.png` is reused unchanged. The stacked logo source also exists at `../assets/peculab-logo-source.png`. |
| NATEA Seattle | Reuses the repository chapter wordmark at `../assets/bridge-network/natea-seattle-adapted.png`. |
| NSF A3D3 Institute | Uses the official circular institute badge at `assets/logos/a3d3.png`. |
| DIGITIMES | Uses the official website wordmark at `assets/logos/digitimes.svg`. |

Prepare the approved 1200 × 630 PNG at `assets/social/og-event.png` with all four approved marks, the event title and subtitle, date, region, and readable PecuLab attribution. Use an approved portrait if available. Set static `og:image` to the absolute production URL of the image and add `og:image:width`, `og:image:height`, `og:image:alt`, and `twitter:image`. Change the card to `summary_large_image`. The draft is omitted from live share metadata.

### GitHub Pages

After organizer approval, review and commit the event directory, then push it to the configured GitHub Pages publishing branch (`main`). The existing Jekyll workflow builds the site and its `jekyll-sitemap` plugin generates the sitemap. Verify the event URL in the built sitemap and confirm the page and its assets return HTTP 200 after publication.

Production URL: https://peculab.github.io/natea-digitimes-2026/

The homepage’s Workshop & Event Archive is the integration point. Once the public announcement is approved, add a link there using the existing style, titled “Seattle Technology & Industry Forum 2026,” to `./natea-digitimes-2026/`.

## Zeffy administrative setup

1. New members submit the [NATEA Seattle membership application](https://forms.gle/pYDFZctFUzKXJVDAA) first, then return here to pay in Zeffy. If you manage the Google Form, add the Zeffy payment link to its submission confirmation. In the [membership campaign](https://www.zeffy.com/en-US/ticketing/north-american-taiwanese-engineers-associations-memberships), confirm Annual Membership ($30), Student Membership ($0), and Lifetime Membership ($300). The annual term runs January 1 through December 31, 2027. Confirm whether early 2027 purchasers qualify for the December 2026 forum before that term starts.
2. In the [event campaign](https://www.zeffy.com/en-US/ticketing/ai-semiconductors-and-global-supply-chains-a-conversation-with-colley-hwang), configure General Admission ($20) and Eligible NATEA Member Admission ($0). The public page now describes the organizer-confirmed discount-code notification. Send the code privately to members who opt in on the application after confirming annual membership payment and test it at event checkout to confirm a $0 ticket is issued. Confirm the intended one-ticket limit and make paid and member tickets share a common event capacity.
3. If Zeffy cannot verify early purchasers, use organizer-controlled manual approval or individually issued or restricted-use discounts if available. Keep private codes out of all source, public links, social metadata, and templates.
4. Validate payment and ticket administration with the organizer. The attendee list lives in the single Zeffy event campaign. Membership enrollment and the [previous expression-of-interest form](https://forms.gle/JnM8eeTEuwASzsoT8) are separate from official event ticketing. Notify previous interest-form participants after launch.

## Partner UTM links

- [natea](https://peculab.github.io/natea-digitimes-2026/?utm_source=natea&utm_medium=partner&utm_campaign=colley_hwang_seattle_2026)
- [a3d3](https://peculab.github.io/natea-digitimes-2026/?utm_source=a3d3&utm_medium=partner&utm_campaign=colley_hwang_seattle_2026)
- [digitimes](https://peculab.github.io/natea-digitimes-2026/?utm_source=digitimes&utm_medium=partner&utm_campaign=colley_hwang_seattle_2026)
- [peculab](https://peculab.github.io/natea-digitimes-2026/?utm_source=peculab&utm_medium=partner&utm_campaign=colley_hwang_seattle_2026)

Additional campaign source identifiers are in `analytics.allowedSources`. Use `utm_source`, `utm_medium`, `utm_campaign`, and, when approved, `utm_content`. Add fixed label values to the allowlists before distribution. Shared links always use the canonical landing page.

## Analytics

Analytics starts disabled. An approved integration can listen for the document event `forum:analytics` before `app.js` executes. Set the provider to `custom-event`, optionally supply a measurement identifier, and enable tracking only after review. The adapter emits interaction events and allowlisted campaign labels in memory. A listening integration must implement any external transport or applicable consent settings.

Page views count loads and differ from unique visitors. Section views, outbound button clicks, copy operations and share actions measure interactions. Use Zeffy records for completed event registrations, membership applications or payments, and redeemed complimentary tickets. Use organizer check-in records for actual attendance.

## Collect discount code requests in the membership application

Add an optional checkbox to the existing [NATEA Seattle membership application](https://forms.gle/pYDFZctFUzKXJVDAA):

**December 12 Forum with Colley Hwang**

**Yes, I plan to attend and would like to request my member discount code.**

Ask members to use the same email for the form and Zeffy payment. For each checked response, match the payment email to the annual membership transaction and email the code after confirming payment. Track code issuance privately to avoid duplicate sends. Verify the question is visible on the public membership form before publishing the event page. Attendees complete event checkout separately to receive a ticket.


## Membership confirmation email

Activate this template after the complimentary ticket workflow is verified.

**Subject**<br>
Welcome to NATEA Seattle 2027 — Claim Your Complimentary Event Ticket!

Welcome to NATEA Seattle!

Thank you for joining our community. We look forward to connecting with you through professional networking, technology forums, and Taiwan–U.S. collaboration opportunities.

As a special membership benefit, eligible members are invited to attend our upcoming forum free of charge:

AI, Semiconductors & Global Supply Chains: A Conversation with Colley Hwang

Date: December 12, 2026

To claim your complimentary event ticket, please visit:

https://peculab.github.io/natea-digitimes-2026/#claim-member-ticket

Use the discount code provided in your private member notification at Zeffy event checkout. Complete checkout to receive your $0 event ticket.

Membership enrollment alone does not reserve an event seat. A separate event ticket is required, and registration is subject to availability.

We look forward to seeing you!

NATEA Seattle

## Organizer promotional templates

### LinkedIn announcement

Use after registration is open and the membership benefit is verified.

AI, Semiconductors & Global Supply Chains: A Conversation with Colley Hwang

Join us on December 12, 2026, for a special technology and industry forum exploring artificial intelligence, semiconductor innovation, global supply chains, and Taiwan–U.S. collaboration.

Organized by NATEA Seattle.<br>
Co-organized by NSF A3D3 Institute.<br>
Featuring Colley Hwang from DIGITIMES.<br>
PecuLab is an event partner.

General Admission: $20<br>
2027 NATEA Annual Membership: $30, including complimentary admission to this special event for eligible members who claim a separate ticket.

One event. A full year of connections.

Learn more and register: https://peculab.github.io/natea-digitimes-2026/

### Short community announcement

Join NATEA Seattle and NSF A3D3 Institute for a conversation with Colley Hwang from DIGITIMES on AI, semiconductors, and global supply chains.

December 12, 2026<br>
Greater Seattle Area

Explore event details and registration options: https://peculab.github.io/natea-digitimes-2026/

PecuLab is an event partner.

## Review verification

Local Chromium checks covered 1440, 1024, 768, 375, and 320 px viewports, mobile layout, visible agenda and expandable sharing, no-JavaScript content, relative assets, registration status combinations, and the analytics adapter using simulated inputs. Both ticket types resolve to the supplied event campaign when enabled. The organizer still needs to verify both live campaigns, member eligibility and redemption, the final sharing graphic, screen-reader behavior, and the production sitemap. No live registration was submitted during testing.

## Post-event archive

Set the status to `completed`, disable registration, and add an approved `recap` when available. Update the static status, calls to action, copy, and any public recap links so the same URL remains usable as a historical record. Keep any attendee lists in Zeffy. Use an appropriate membership link if enrollment is still active.
