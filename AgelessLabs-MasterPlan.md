# AgelessLabs.ai — Master Project Plan

> Single source of truth. Replaces all prior planning notes.
> Last updated: May 28, 2026 · 11:30 PM CST

---

## The Business

AgelessLabs.ai is a longevity-focused content site with an integrated AI biomarker interpreter tool. The content builds organic SEO traffic. The AI tool converts that traffic into revenue. Both drive affiliate income from lab testing companies.

**Domain:** AgelessLabs.ai (primary) · AgelessLabs.com (redirect — owned by someone else, expires October 2026)
**Tagline:** Understand what your labs reveal about how long you'll live.
**Status:** Live, indexed, and fully SEO/LLM-clean

**Target audience:** Health-conscious adults aged 35–65 who track biomarkers, spend on diagnostics and supplements, and are serious about longevity optimization.

---

## Revenue Streams

| Stream | Status | Notes |
|---|---|---|
| Affiliate commissions from lab testing partners | Live (links in place) | Primary revenue driver |
| AI report upgrade — $19 one-time | Live — May 19 2026 | Stripe live mode active |
| Display advertising | Deferred | Later stage, once traffic scales |

---

## Affiliate Partners

| Company | Status | Link / Notes |
|---|---|---|
| Ulta Lab Tests | Active | `ultalabtests.com/partners/agelesslabs/test/[slug]` |
| Superpower | Active — approved May 26 2026 | https://superpower.com/welcome?dub_id=d99GM8QoZlGRZs2y |
| InsideTracker | Application pending — May 26 2026 | $30–60 per sale |
| OneTwenty | Application pending — May 26 2026 | — |
| Marek Health | Application pending | — |
| Life Extension | Active | Supplements + lab tests · 8–12% |
| SiPhox Health | TBD | At-home finger-prick testing |
| Mito Health | TBD | Biomarker + biological age scoring |
| Function Health | Removed — unresponsive | — |

---

## The Core Product — AI Biomarker Interpreter

The centerpiece of AgelessLabs.ai. A free tool that analyzes lab results through a longevity lens, converting visitors into engaged users and driving affiliate recommendations naturally.

### Free Tier
- User uploads PDF/image or pastes lab results
- AI returns a longevity score (0–100), per-marker breakdown with status (optimal / monitor / concern), narrative summary, and top recommendations
- Affiliate lab testing recommendations embedded in results

### Paid Tier — Full Longevity Report ($19 one-time) — Live
- Age- and sex-adjusted optimal ranges
- Trend tracking across multiple tests
- Personalized longevity protocol
- Recommended tests to order next (with affiliate links)
- Downloadable PDF report

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | HTML / CSS / Nunjucks | Via 11ty static site generator |
| Site generator | Eleventy (11ty) v2 | Chosen over Next.js — right complexity for content-first site |
| AI | Claude API (claude-sonnet-4-6) | Model string updated in analyze.njk — April 15 2026 |
| Payments | Stripe | Live — May 19 2026 |
| Hosting | Vercel | Auto-deploys from GitHub on push to main |
| Template language | Nunjucks (.njk) | Single base layout, pages extend it |

---

## Project Structure

```
agelesslabs/
├── api/
│   ├── analyze.js            # Vercel serverless proxy — forwards requests to Anthropic API
│   ├── subscribe.js          # Vercel serverless proxy — forwards email signups to MailerLite API
│   ├── stripe-checkout.js    # Creates Stripe Checkout session
│   ├── stripe-verify.js      # Verifies Stripe session after redirect
│   └── digest.js             # Vercel Edge function — community digest (Reddit + rapamycin.news)
├── .eleventy.js              # 11ty config — filters, collections, passthrough, dirs
├── package.json              # npm scripts: build, start, dev
├── vercel.json               # buildCommand, outputDirectory: _site
└── src/
    ├── _includes/
    │   ├── base.njk          # Single shared layout: head, nav, mobile menu, footer, scripts
    │   └── biomarker.njk     # Biomarker page template — all 66 pages use this
    ├── biomarkers/
    │   ├── index.njk         # Biomarker library index — all 66 markers, 5 categories
    │   └── [66 .njk files]   # All live and indexed — see wave breakdown below
    ├── blog/
    │   └── blog-index.njk    # Blog placeholder — 6 categories, priority post list
    ├── index.njk             # Homepage
    ├── about.njk             # About page
    ├── analyze.njk           # AI tool page
    ├── digest.njk            # Community digest dashboard — key-protected, noindexed
    ├── email-thank-you.njk   # Email capture confirmation — noindexed, live at /email-thank-you/
    ├── get-tested.njk        # "Get Your Baseline" affiliate page — live at /get-tested/
    ├── longevity-lab-guide.njk  # Email lead magnet — noindexed, live at /longevity-lab-guide/
    ├── privacy.njk           # Privacy policy
    ├── disclaimer.njk        # Disclaimer + affiliate disclosure
    ├── sitemap.njk           # Auto-generates /sitemap.xml — dynamic loop only, no hardcoded URLs
    ├── styles.css            # Global stylesheet (passthrough to _site)
    ├── favicon.svg           # Favicon (passthrough to _site)
    ├── og-image.png          # OG image 1200x630 (passthrough to _site)
    ├── robots.txt            # 12 crawlers + AI agents explicitly permitted
    └── llms.txt              # AI agent site description — all 66 biomarker URLs listed
```

### Key Conventions
- **Nav and footer** defined once in `src/_includes/base.njk` — edit there, propagates to all pages
- **Mobile menu** lives in `base.njk` — full-screen overlay, slides in from right, styles inline in `<style>` block in head, JS inline before `</body>`
- **Biomarker pages** use `layout: biomarker.njk` in frontmatter (NOT base.njk directly)
- **All other pages** use `layout: base.njk` in frontmatter — **always verify this is present after batch edits**
- **analyze.njk** uses `analyzePage: true` in frontmatter — swaps "Try Free" nav CTA for "Beta" badge
- **Page-specific styles** go in a style block at the top of the page file
- **Biomarker index and blog index** use `eleventyExcludeFromCollections: true`
- **Biomarker pages** no longer use `noindex: true` — all 66 fully indexed
- **og-image.png** uses a hyphen — og-image.png, not ogimage.png
- **Arrow characters** in index cards use `&#8594;` HTML entity — NOT the Unicode arrow, which mojibakes in the GitHub editor
- **base.njk must have `---\n---` (empty frontmatter with closing delimiter)** — a single opening `---` with no closing causes gray-matter to parse the entire HTML file as YAML, crashing the build
- **sitemap.njk** uses a single `collections.all` loop — never add hardcoded `<url>` blocks inside or outside the loop; they will be multiplied or duplicated
- **Pages to exclude from sitemap** — add URL conditions to the `{%- if %}` filter in sitemap.njk: currently excludes `/google84b2549f1010612c/`, `/digest/`, `/email-thank-you/`, `/longevity-lab-guide/`

### .eleventy.js Filters
- `htmlDateString` — formats dates for sitemap.njk (ISO 8601)
- `initials` — generates avatar initials from a name (e.g. "Dan Carey" to "DC")

### Vercel Environment Variables
| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | api/analyze.js, api/digest.js | Claude API — set in Vercel dashboard |
| `ML_API_KEY` | api/subscribe.js | MailerLite API token |
| `DIGEST_KEY` | api/digest.js | Secret string protecting the /digest endpoint |
| `STRIPE_SECRET_KEY` | api/stripe-checkout.js, api/stripe-verify.js | Live mode active May 19 2026 |
| `STRIPE_PRICE_ID` | api/stripe-checkout.js | Live price ID |

---

## Build & Deploy Commands

```bash
npm install        # First time only
npm start          # Local dev server (localhost:8080)
npm run build      # Production build to _site/
```

Vercel auto-builds on push to main. Build command: `npm run build`. Output: `_site/`.

---

## Development Tooling & Workflow

### Claude Project
All development work happens inside the AgelessLabs Claude Project. Start every session by saying "Where are we?" — Claude will read the project files and resume from current status.

### GitHub Repository
**Repo:** `github.com/paramost/agelesslabs` (public)

GitHub is the source of truth. Claude accesses files via two methods:

**1. Claude in Chrome (preferred):** Extension is connected — Claude can navigate GitHub directly, read raw files, and edit via the web editor without URL pasting. Connect at start of session via `list_connected_browsers` → `select_browser`. Browser 1 (Windows) is the connected instance.

**2. Raw URL fetch fallback:** If browser isn't connected, paste raw URLs directly:
`https://raw.githubusercontent.com/paramost/agelesslabs/main/src/[path/to/file]`

**GitHub editing via browser:** Claude edits files directly in the GitHub web editor using CodeMirror 6 automation. Access via `document.querySelector('.cm-content').cmTile.view`. Use `view.dispatch({ changes: { from, to, insert } })` to make programmatic edits.

**Reliable commit technique (tested May 27 2026):**
```javascript
// 1. Apply change via view.dispatch()
// 2. Release editor focus:
document.querySelector('.breadcrumb')?.click();
await new Promise(r => setTimeout(r, 800));
// 3. Open commit dialog:
const ob = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent.trim().startsWith('Commit changes') && !b.closest('[role="dialog"]'));
if (ob) ob.click();
await new Promise(r => setTimeout(r, 800));
// 4. Confirm in dialog:
const cb = Array.from(document.querySelectorAll('button'))
  .find(b => b.closest('[role="dialog"]') && b.textContent.trim() === 'Commit changes');
if (cb) cb.click();
```
Never type commit messages while CodeMirror has focus — they go into the file.

**New file creation:** Use GitHub's upload page (`/upload/main/src`) and drag the file into the drop zone. Do NOT use the "new file" editor (`/new/main/src`) — it becomes unstable with large files.

### Google Drive — Working Files
**Folder:** AgelessLabs > Source Files
Drive is a staging area. Master plan is kept as a project file in the Claude Project — read from there at session start.

---

## Current Build Status

### Infrastructure
| Item | Status |
|---|---|
| Domain — AgelessLabs.ai | Live |
| Domain — AgelessLabs.com | Acquire when expires October 2026 |
| Social handles — Twitter/X + Instagram | Secured |
| Trademark check at USPTO.gov | Not done |
| Google Search Console | Verified + sitemap submitted — April 21 2026 |
| GitHub repo | Set up (public) |
| Vercel hosting | Live |
| 11ty migration | Complete |

### Pages
| Page | Status | Notes |
|---|---|---|
| index.njk | Complete | Homepage with hero, how-it-works, lab test affiliates |
| about.njk | Complete | Mission, principles, values grid, named founder (Dan Carey) |
| privacy.njk | Complete | Privacy policy |
| disclaimer.njk | Complete | Disclaimer + affiliate disclosure |
| analyze.njk | Complete | AI tool — free + paid tiers live |
| biomarkers/index.njk | Complete | 66 markers, 5 categories, "Library Complete" banner |
| _includes/biomarker.njk | Complete | Layout template for all biomarker pages |
| blog/blog-index.njk | Complete | Placeholder — 6 content categories, priority post list |
| digest.njk | Complete | Key-protected community digest dashboard |
| get-tested.njk | Complete — May 21 2026 | "Get Your Baseline" page — Ulta + Superpower cards live |
| email-thank-you.njk | Complete | Confirmation page — noindexed · live at /email-thank-you/ |
| longevity-lab-guide.njk | Complete — May 28 2026 | Email lead magnet — noindexed · live at /longevity-lab-guide/ |

### Biomarker Pages — Complete Library (66 pages across 9 waves)

**Wave 1 — 18 pages (Complete — April 2026)**
apob, hba1c, hscrp, vitamin-d, testosterone, homocysteine, ferritin, tsh, igf-1, fasting-insulin, triglycerides, omega-3-index, ldl-hdl, cortisol, uric-acid, creatinine-egfr, albumin, lipoprotein-a

**Wave 2 — 6 pages (Complete — May 25 2026)**
alt-ast, magnesium, vitamin-b12, dhea-s, psa, free-testosterone

**Wave 3 — 6 pages (Complete — May 25 2026)**
shbg, estradiol, ggt, fibrinogen, cystatin-c, folate

**Wave 4 — 6 pages (Complete — May 25 2026)**
apolipoprotein-a1, zinc, cbc, selenium, hs-troponin, tmao

**Wave 5 — 6 pages (Complete — May 25 2026)**
lp-pla2, adiponectin, leptin, coenzyme-q10, galectin-3, nmr-lipoprofile

**Wave 6 — 6 pages (Complete — May 25 2026)**
iron-tibc, progesterone, c-peptide, vitamin-a, il-6, prolactin

**Wave 7 — 6 pages (Complete — May 25 2026)**
fasting-glucose, fsh, free-t3-t4, dht, alp, calcium

**Wave 8 — 6 pages (Complete — May 26 2026)**
lh, reverse-t3, vitamin-k2, urine-microalbumin, pth, bun

**Wave 9 — 6 pages (Complete — May 26 2026) — LIBRARY COMPLETE**
vitamin-b6, copper, bilirubin, phosphorus, nt-probnp, vitamin-c

**Final category breakdown:** Cardiovascular 14 · Metabolic 20 · Inflammation 2 · Hormonal 16 · Nutrients 15

### Tool
| Item | Status |
|---|---|
| AI tool — free tier | Complete |
| Paid tier ($19 report) | Complete — May 19 2026 |
| Stripe integration | Complete — live mode active May 19 2026 |
| Stripe conversion tracking (GA4) | Complete — May 28 2026 · purchase event marked as key event in GA4 |
| Email capture | Complete — MailerLite v2 API. Group ID: 187945335219291618. Welcome sequence delivers /longevity-lab-guide/. |
| Model string | claude-sonnet-4-6 |

### Email Lead Magnet
Complete — May 28 2026. Live at `/longevity-lab-guide/`. Noindexed + excluded from sitemap. Delivered via MailerLite welcome sequence. Content: 10-biomarker longevity guide with optimal ranges, 90-day plan, Ulta + Superpower affiliate CTAs, and $19 paid report upsell.

### Community Digest Tool
Complete — April 23 2026. Key-protected at `/digest`. Caching not built — generates live (~20s, ~$0.08/run). Add Vercel KV + GitHub Actions cron when daily usage warrants it.

### Design / CSS
All complete. Dark theme only — revisit if mobile bounce data warrants it.

### Technical SEO
All complete. GSC verified + sitemap submitted April 21 2026.

### Analytics
GA4 (G-28CHRFJLKJ) + Microsoft Clarity (wa32lp8ja6) — both live on all page types. GA4 `purchase` event live and marked as key event — May 28 2026.

---

## Immediate Next Steps (Resume Here)

### Phase 5.7 — Full Site Audit — COMPLETE (May 28 2026)

All 4 sessions complete. Full findings and fixes:

**Session 1 — Sitemap + URL health + robots meta — COMPLETE (May 27 2026)**

| Issue | Fix | Status |
|---|---|---|
| Sitemap had 3,675 URLs (hardcoded blocks inside loop × 55 pages) | Rewrote sitemap.njk as pure dynamic loop | ✅ Fixed |
| All 75 URLs return 200 | Zero failures | ✅ Clean |
| GSC verification file, digest, email-thank-you in sitemap | Added URL exclusions to sitemap.njk if condition | ✅ Fixed |
| biomarkers/index.njk lost `layout: base.njk` — full CSS failure | Restored layout declaration | ✅ Fixed |
| bmi-hero `</section>` mismatched tag causing blank gap | Fixed to `</div>` | ✅ Fixed |
| "66+ Biomarkers planned" stat contradicted "66 Live" | Removed redundant stat | ✅ Fixed |

**Session 2 — Frontmatter audit + title tag shortening — COMPLETE (May 27 2026)**

All 66 pages passed on every critical check: layout, noindex, MedicalWebPage schema, FAQPage schema, title tags, meta descriptions, robots meta, canonical tags. 57 title tags shortened to under 68 chars across 5 batches.

**Session 3 — Link audit — COMPLETE (May 28 2026)**

| Check | Result |
|---|---|
| All 66 pages have Ulta affiliate links | ✅ |
| All 66 pages have PubMed citations | ✅ Fixed c-peptide (was missing all citations) |
| All 66 pages have 5 related biomarker links | ✅ Fixed 15 pages across 3 batches |
| All 66 biomarker index cards present, no broken slugs | ✅ |
| Ulta + PubMed HTTP status | Unverifiable from automated environment (WAF blocks data center IPs) — Ulta manually spot-checked (4 links confirmed) |

**Session 4 — Schema + analytics + tool/Stripe end-to-end — COMPLETE (May 28 2026)**

| Check | Result |
|---|---|
| MedicalWebPage + FAQPage schema on biomarker pages | ✅ Confirmed live (ApoB + vitamin-c) |
| GA4 firing — homepage, biomarker, analyze | ✅ |
| Clarity firing — homepage, biomarker, analyze | ✅ |
| Free analysis end-to-end | ✅ Returns score + per-marker breakdown |
| Paid tier Stripe checkout | ✅ Redirects to checkout.stripe.com with live session |

**Post-audit checks — COMPLETE (May 28 2026)**

| Check | Result |
|---|---|
| Related link fixes verified live (omega-3-index, ferritin, c-peptide) | ✅ |
| Email capture flow (form → MailerLite → /email-thank-you/) | ✅ All working |
| Ulta affiliate links manual spot-check (4 links) | ✅ All resolve with affiliate attribution |
| /get-tested page audit | ✅ Rendering, analytics, links all clean |
| Superpower card added to /get-tested | ✅ Live — May 28 2026 |
| Biomarker index intro card layout fixed (stray </div> closing container) | ✅ Live — May 28 2026 |

---

### Phase 5.8 — Stripe Conversion Tracking — COMPLETE (May 28 2026)

GA4 `purchase` event added to `src/analyze.njk` — fires immediately after `stripe-verify` returns `success: true`. Uses `sessionId` as `transaction_id` for deduplication. Event marked as key event in GA4 Admin → Events.

---

### NEXT: Tier 2 Content — Lab Test Comparison Pages

**Priority Tier 2 pages:**

| # | Page | Slug | Primary Affiliate | Notes |
|---|---|---|---|---|
| 1 | Function Health vs Superpower vs InsideTracker vs OneTwenty | `/compare/longevity-blood-tests` | Superpower + Ulta | Include OneTwenty — in every 2026 roundup |
| 2 | Best blood tests for men over 40 | `/guides/blood-tests-men-over-40` | Ulta + Superpower | Lead with ApoB/Lp(a)/fasting insulin — what doctors skip |
| 3 | Best blood tests for women over 40 | `/guides/blood-tests-women-over-40` | Ulta + Superpower | Lead with perimenopause angle; thyroid-mimicking-menopause is key sub-topic |
| 4 | Ulta Lab Tests review — is it legit? | `/reviews/ulta-lab-tests` | Ulta | Address Hawaii DOH violation directly; thin competition |
| 5 | Function Health review | `/reviews/function-health` | Ulta as alternative | High volume; drive Ulta as DIY alternative |
| 6 | Superpower Health review | `/reviews/superpower-health` | Superpower | Fast-rising term; affiliate approved |
| 7 | Best longevity blood panel guide | `/guides/best-longevity-blood-panel` | Ulta + Superpower | Catch-all guide; heavy Ulta integration |

**Format:** 1,500–2,500 words · Review/comparison format · Intro / what's included / who it's for / pros-cons table / pricing / verdict / FAQ (5–6 Qs) / affiliate CTAs

**Key research findings:**
- OneTwenty appearing in every 2026 comparison roundup — include even without affiliate
- Ulta review competition is weak (thin affiliate sites) — big opportunity with honest review
- Hawaii DOH issued Ulta a violation notice (Jan 2026) for operating without authorization — address directly
- Women over 40: "can blood tests confirm perimenopause?" is the dominant search question
- Men over 40 differentiation: ApoB/Lp(a)/fasting insulin — what doctors routinely skip
- Current pricing (May 2026): Superpower $199/yr · Function Health $365/yr · InsideTracker $489 entry

---

### Phase 6 — Medical Review (deferred)
Decision (April 19 2026): Not a launch blocker. Revisit once affiliate revenue is consistent.

Candidates: Cynthia Thurlow NP · Jenni Gallagher MSN NP-C · Upwork fallback (NP/DNP functional medicine)

### Phase 7 — Course Product (deferred)
"How to Build a Money-Making Website with Claude." Don't launch until "here's what I made in month 3" story exists.

### Phase 8 — Next Site (deferred)
Apply AgelessLabs system to a new niche.

---

## Known Issues / Tech Debt

- **Digest caching not built** — generates fresh on every load (~20s, ~$0.08/run). Add Vercel KV + GitHub Actions cron when daily usage warrants it.
- **HTML entities in JSON-LD title strings** — low priority. Pages with `&#8212;` in title frontmatter have literal string in JSON-LD. Not a validity issue.
- **Vitamin K2 page note** — Ulta "vitamin-k" test measures total K (K1+K2 combined). Page accurately notes this and recommends ucOC as the functional K2 marker.
- **MailerLite v2 classic API** — `api/subscribe.js` uses `api.mailerlite.com/api/v2`. Classic API still functional but a newer API exists. Low urgency.
- **No custom 404 page** — broken URLs hit Vercel's default. A branded 404 with links to the biomarker library and tool would recover more traffic.
- **OG images not page-specific** — all pages share one `og-image.png`. Matters more once traffic and social sharing scale.
- **InsideTracker, OneTwenty, Marek Health affiliate applications** — follow-up emails needed, not code changes.
- **Trademark check at USPTO.gov** — not done.

---

## Key Learnings & Principles

- **YAML frontmatter duplicate keys cause silent build failures** — specifically duplicate permalink keys.
- **base.njk robots meta should be dynamic** — Nunjucks conditional: noindex/follow when `noindex: true`, index/follow otherwise.
- **Biomarker pages use `layout: biomarker.njk`** — don't duplicate schema in individual page files.
- **Arrow characters** in index cards must use `&#8594;` HTML entity.
- **`{{ variable | dump | safe }}` inside JSON-LD** — required to prevent HTML-escaping.
- **All YAML frontmatter variables output in HTML require `| safe`** — Nunjucks auto-escapes `&` to `&amp;`.
- **YAML source files should use plain Unicode characters** — `—` not `&#8212;`.
- **base.njk must use `---\n---` (two delimiter lines)** for frontmatter.
- **The Claude API cannot be called directly from browser JS** — always route through Vercel serverless function.
- **MailerLite API** — v2 classic API. Group ID: `187945335219291618`. Route through `api/subscribe.js`. Env var: `ML_API_KEY`. Not Kit/ConvertKit.
- **Ulta Lab Tests URL slugs are not predictable** — always verify via `site:ultalabtests.com [test name]`.
- **Biomarker library stopping point** — 66 pages (Waves 1–9). Pivot to Tier 2/3 content.
- **GitHub CodeMirror commit technique** — use `breadcrumb.click()` + `setTimeout(800)` to release editor focus before opening commit dialog. Then find and click the dialog's "Commit changes" button via `b.closest('[role="dialog"]') && b.textContent.trim() === 'Commit changes'`. Never type commit messages while CodeMirror has focus.
- **New file creation via GitHub** — use the upload page (`/upload/main/src`) and drag-and-drop. Do NOT use the "new file" editor (`/new/main/src`) — it becomes unstable with large files and the feedback dialog blocks the commit dialog.
- **index.njk `layout: base.njk` critical** — this declaration gets silently dropped during batch edit sessions. Always verify it's present after any batch edit to biomarkers/index.njk.
- **Sitemap hardcoded `<url>` blocks** — must NEVER be placed inside or around the `collections.all` loop in sitemap.njk.
- **Sitemap URL exclusions** — add unwanted pages to the `{%- if %}` condition as `and item.url != '/slug/'` rather than editing individual files.
- **Vitamin K2 serum testing limitation** — no consumer lab offers specific serum K2. Standard tests measure total K (predominantly K1). Functional K2 status: ucOC at specialty labs.
- **Title tag length** — target under 68 chars total including ` | AgelessLabs`.
- **CodeMirror title replacement pattern** — read old title line first with `doc.split('\n').find(l => l.includes('title:'))`, then use `doc.indexOf(oldLine)` to locate and replace.
- **Ulta + PubMed HTTP verification** — both block data center IPs (403). Browser extension also blocks navigation to ultalabtests.com. Manual spot-check from a real browser is the only reliable method.
- **checkout.stripe.com blocks browser extension navigation** — after Stripe redirect, open a new MCP tab via `tabs_create_mcp` to continue browser automation.
- **Biomarker index container bug pattern** — `<section>` tag closed with `</div>` causes the container div to close early, ejecting all subsequent content from the layout. Check rendered DOM parent of `.bmi-intro` if layout breaks.

---

## Revenue Projections

| Milestone | Monthly Traffic | Affiliate Revenue | Tool Revenue | Total |
|---|---|---|---|---|
| Month 3 | 2,000 | $300 | $200 | ~$500 |
| Month 6 | 8,000 | $1,200 | $600 | ~$1,800 |
| Month 12 | 30,000 | $4,500 | $1,500 | ~$6,000 |
| Month 18 | 80,000 | $12,000 | $3,500 | ~$15,500 |

---

## Brand Direction

- **Voice:** Authoritative, clinical, aspirational — not wellness-fluffy
- **Aesthetic:** Deep green on near-black, DM Mono for labels/data, Red Hat Display for headings
- **Color palette:** #111210 bg · #b5c9a0 green · #eef2ea near-white · #c8a96e gold
- **Theme:** Dark only (no light theme) — re-evaluate if mobile bounce data warrants it
- **Domain:** AgelessLabs.ai — .ai signals AI-powered tool, resonates with tech-forward longevity audience

---

## How to Resume Development with Claude

1. Open a conversation inside the AgelessLabs Claude Project
2. Say: "Where are we?" — Claude will read the project files and resume from current status above.

**Keep this file current.** When something gets built or decided, update the status table and next steps here. This is the source of truth across all chats.

---

## Working Session Rules

### Rule 1 — Plan before touching files
State full plan → get explicit approval → execute one file at a time. No exceptions.

### Rule 2 — Batch multi-file tasks at 6 files maximum per session
Split larger tasks across sessions. Propose batches upfront, complete first batch, confirm, then stop.

### Rule 3 — File delivery method by task type

| Task type | Method |
|---|---|
| Small targeted edit (<20 lines, 1–2 files) | GitHub direct edit via browser automation |
| New file or heavily rewritten file | GitHub upload page (/upload/main/src) — drag and drop |
| Master plan updates | Downloadable artifact, Dan uploads to project manually |
| Never | Drive MCP for .njk or .js files (silent truncation above ~3KB) |

### Rule 4 — Flag resource-intensive paths before starting
More than 8 tool calls → stop, state requirements, propose batching plan, get approval.

### Rule 5 — Confirm completed work before updating the master plan
Status entries not marked Complete until file is verified.

### Rule 6 — When in doubt, ask
One clarifying question before starting ambiguous tasks.

---

## Content Strategy

### Serving Three Masters
1. **Please search engines & AI agents** — structured, semantically rich content
2. **Be genuinely useful to humans** — real depth, honest analysis
3. **Drive revenue** — tool CTAs, affiliate links, paid report upsells

### Content Architecture

#### Tier 1 — Biomarker Reference Library — COMPLETE (66 pages)
All 66 pages complete across Waves 1–9. Do not add more biomarker pages.

#### Tier 2 — Lab Test Comparison & Buyer's Guide Pages — NEXT PRIORITY
See Tier 2 content plan in Immediate Next Steps above.

#### Tier 3 — Protocol & Optimization Guides
Categories: Metabolic Health, Cardiovascular, Hormonal Health, Inflammation & Immune, Nutrient Optimization.

### Content Quality Standards
- Minimum 1,200 words for biomarker pages; 1,800+ for guides
- At least 2 links to primary research (PubMed, clinical studies)
- One comparison table where applicable
- FAQ section at end (minimum 4 Q&As, FAQ schema)
- Tool CTA embedded at least once mid-article
- Affiliate link where contextually appropriate (never forced)
- Meta description optimized for click-through and AI extraction

---

## Paid Report Spec — $19 one-time

**Payment flow:** Free results → "Unlock Full Report — $19" → Stripe Checkout → payment → redirect to `/analyze?session_id=xxx` → verify → GA4 purchase event fires → paid analysis runs → full report renders + PDF download

**Files:** `api/stripe-checkout.js` · `api/stripe-verify.js` · `src/analyze.njk` · `package.json`

**Stripe config — LIVE MODE (May 19 2026):** `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` in Vercel env vars.

**Ulta affiliate links — all 18 Wave 1 confirmed.** Format: `ultalabtests.com/partners/agelesslabs/test/[slug]`.

| Biomarker | Slug |
|---|---|
| ApoB | apolipoprotein-b |
| HbA1c | hemoglobin-a1c-hgba1c |
| hsCRP | hs-crp |
| Vitamin D | vitamin-d-25-hydroxy-total-immunoassay |
| Testosterone | testosterone-total-male-test-adult-only |
| Homocysteine | homocysteine |
| Ferritin | ferritin |
| TSH + Free T3/T4 | thyroid-health-test-package-tsh-ft4-and-ft3 |
| IGF-1 | igf-1-test |
| Fasting Insulin | insulin |
| Triglycerides | triglycerides |
| Omega-3 Index | omegacheck-test |
| LDL/HDL | lipid-panel |
| Cortisol | cortisol-am-test |
| Uric Acid | uric-acid |
| Creatinine/eGFR | creatinine |
| Albumin | albumin-test |
| Lp(a) | lipoprotein-a |

*AgelessLabs.ai — Master Project Plan · May 2026*
