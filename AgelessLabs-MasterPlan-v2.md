# AgelessLabs.ai — Master Project Plan

> Single source of truth. Replaces all prior planning notes.
> Last updated: July 21, 2026 · CST

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
| Affiliate commissions from lab testing partners | Live (links in place, click tracking live on /get-tested/) | Primary revenue driver |
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
| Search | Pagefind | Build-time static index — runs after Eleventy via `npm run build` |

---

## Project Structure

```
agelesslabs/
├── api/
│   ├── affiliate-click.js    # Vercel serverless function — logs affiliate clicks to Google Sheet, redirects to partner
│   ├── analyze.js            # Vercel serverless proxy — forwards requests to Anthropic API
│   ├── subscribe.js          # Vercel serverless proxy — forwards email signups to MailerLite API
│   ├── stripe-checkout.js    # Creates Stripe Checkout session
│   ├── stripe-verify.js      # Verifies Stripe session after redirect
│   ├── digest.js             # Vercel Edge function — community digest (Reddit + rapamycin.news)
│   ├── feedback.js           # Vercel serverless function — appends feedback rows to Google Sheet
│   ├── gsc-ga4.js            # Vercel serverless function — GSC + GA4 analytics for ops dashboard
│   └── gsc-setup.js          # One-time OAuth2 setup endpoint — generates GOOGLE_REFRESH_TOKEN
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
    │   └── blog-index.njk    # Blog placeholder — 6 content categories, priority post list
    ├── guides/
    │   ├── index.njk         # Guides index — all 8 guides listed (3 Tier 2 + 5 Tier 3)
    │   ├── best-longevity-blood-panel.njk
    │   ├── blood-tests-men-over-40.njk
    │   ├── blood-tests-women-over-40.njk
    │   ├── how-to-lower-apob.njk
    │   ├── how-to-improve-insulin-sensitivity.njk
    │   ├── how-to-optimize-testosterone.njk
    │   ├── how-to-reduce-inflammation.njk
    │   └── how-to-fix-nutrient-deficiencies.njk
    ├── reviews/
    │   ├── index.njk         # Reviews index — lists all published reviews
    │   ├── ulta-lab-tests.njk
    │   ├── superpower-health.njk
    │   └── function-health.njk
    ├── compare/
    │   └── longevity-blood-tests.njk  # 6-service comparison — live at /compare/longevity-blood-tests/
    ├── index.njk             # Homepage
    ├── about.njk             # About page
    ├── analyze.njk           # AI tool page
    ├── digest.njk            # Community digest dashboard — key-protected, noindexed
    ├── 404.njk               # Custom 404 page — outputs to /404.html, noindexed
    ├── email-thank-you.njk   # Email capture confirmation — noindexed, live at /email-thank-you/
    ├── get-tested.njk        # "Get Your Baseline" affiliate page — all 5 affiliate links route through /api/affiliate-click
    ├── longevity-lab-guide.njk  # Email lead magnet — noindexed, live at /longevity-lab-guide/
    ├── search.njk            # Site search — live at /search/ · Pagefind-powered
    ├── ops.njk               # Marketing ops dashboard — key-protected, noindexed · /ops/
    ├── privacy.njk           # Privacy policy
    ├── disclaimer.njk        # Disclaimer + affiliate disclosure
    ├── sitemap.njk           # Auto-generates /sitemap.xml — dynamic loop only, no hardcoded URLs
    ├── styles.css            # Global stylesheet (passthrough to _site)
    ├── favicon.svg            # Favicon (passthrough to _site)
    ├── og-image.png           # OG image 1200x630 (passthrough to _site)
    ├── robots.txt             # 12 crawlers + AI agents explicitly permitted
    └── llms.txt                # AI agent site description — all 66 biomarker URLs listed
```

### Key Conventions
- **Nav and footer** defined once in `src/_includes/base.njk` — edit there, propagates to all pages
- **Mobile menu** lives in `base.njk` — full-screen overlay, slides in from right, styles inline in `<style>` block in head, JS inline before `</body>`
- **Biomarker pages** use `layout: biomarker.njk` in frontmatter (NOT base.njk directly)
- **All other pages** use `layout: base.njk` in frontmatter — **always verify this is present after batch edits**
- **analyze.njk** uses the standard `base.njk` nav like every other page — no special-casing. The former `analyzePage` conditional was removed June 24 2026; the dead `analyzePage: true` frontmatter flag was deleted July 15 2026. Tech debt closed.
- **Page-specific styles** go in a style block at the top of the page file
- **Biomarker index and blog index** use `eleventyExcludeFromCollections: true`
- **Biomarker pages** no longer use `noindex: true` — all 66 fully indexed
- **og-image.png** uses a hyphen — og-image.png, not ogimage.png
- **Arrow characters** in index cards use `&#8594;` HTML entity — NOT the Unicode arrow, which mojibakes in the GitHub editor
- **base.njk must have `---\n---` (empty frontmatter with closing delimiter)** — a single opening `---` with no closing causes gray-matter to parse the entire HTML file as YAML, crashing the build
- **sitemap.njk** uses a single `collections.all` loop — never add hardcoded `<url>` blocks inside or outside the loop; they will be multiplied or duplicated
- **Pages to exclude from sitemap** — add URL conditions to the `{%- if %}` filter in sitemap.njk: currently excludes `/google84b2549f1010612c/`, `/digest/`, `/email-thank-you/`, `/longevity-lab-guide/`, `/404.html`, `/ops/`
- **Guides and reviews index pages** do NOT use `eleventyExcludeFromCollections: true` — they are indexed pages and should appear in the sitemap
- **Nav dropdown** — `base.njk` has a JS-driven hover dropdown on "Reviews" with two items (All Reviews, Longevity Test Comparison). Toggle via `.nav-dropdown-toggle` button; menu opens/closes via `.nav-dropdown-menu.open` class. Close on outside click and Escape key.
- **Nav dropdown button styling** — `.nav-dropdown-toggle` must explicitly set `font-family: 'DM Mono'`, `font-size: 10px`, `letter-spacing: 0.15em`, `text-transform: uppercase`, `color: var(--text-dim)` — browser button defaults override inherited values
- **Mobile nav** — at ≤1024px, `.nav-right .nav-link` and `.nav-right .nav-dropdown` are hidden; `.nav-cta` stays visible alongside the hamburger. (The hide rule still lists `.nav-right .badge` harmlessly — dead selector now that the Beta badge is gone.)
- **Mobile viewport overflow** — `html { overflow-x: hidden }` prevents any overflowing element from expanding the layout viewport on reload
- **Feedback FAB** — checkbox toggle pattern (`#feedbackToggle:checked ~ .feedback-popover`). The FAB is a `<label for="feedbackToggle">`, not a `<button>`. Hidden on `/digest/` only. FAB and popover are direct children of `<body>`, outside `.container`. JS handles only: X/Close button listeners, Escape key, and the async submit + thank-you state swap. Never use a `<button>` as a JS toggle trigger for fixed UI on mobile — use `<label>` + checkbox instead.
- **Nav search icon** — desktop: search icon in nav-right expands inline input on click, navigates to `/search/?q=query` on Enter. Mobile: icon navigates directly to `/search/`. Implemented in `base.njk` with `.nav-search-btn`, `.nav-search-expand`, `.nav-search-input`, `.nav-search-mobile` classes.
- **Sticky nav** — `nav` element has `nav-sticky` class; CSS in `styles.css` sets `position: sticky; top: 0; z-index: 100`. Desktop only effectively (mobile nav collapses at ≤1024px).
- **Scroll offset for sticky header** — `:target { scroll-margin-top: 72px }` in `styles.css` globally offsets all anchor link targets.
- **Pagefind search** — build command in `package.json`: `eleventy && npx pagefind --site _site`. Index auto-regenerates on every Vercel deploy. Search page at `/search/`. Pagefind respects `<meta name="robots" content="noindex">` — noindexed pages excluded from index automatically.
- **Pagefind category metadata** — `data-pagefind-meta="category:VALUE"` added to: `biomarker.njk` (`Biomarker — {{ category }}`), all 8 guide pages (`Guide`), all 3 review pages (`Review`), comparison page (`Comparison`).
- **Pagefind clear button** — styled via CSS overrides to match DM Mono aesthetic (pill button with border). Cannot be replaced with custom element — Pagefind/Svelte rebuilds its DOM on every search, wiping injected elements.
- **Affiliate link pattern (tracked pages)** — `href="/api/affiliate-click?partner=[ulta|superpower]&destination=[URL-ENCODED destination]"`. Destination MUST be URL-encoded (`encodeURIComponent`) or query params in the destination (e.g. Superpower's `dub_id`) get swallowed by the tracker endpoint. Keep `target="_blank" rel="noopener sponsored"` on the anchor.
- **Logo wordmark markup** — `<span class="ageless">ageless</span><span class="labs">labs</span><span class="dot">.</span><span class="ai">ai</span>` — identical across all 3 instances (nav, footer, mobile menu). The `.dot` span was already present pre-July 2026, so the pulsing-period animation (shipped July 20 2026) only required a `styles.css` change — no `base.njk` markup edit was needed, contrary to original scope estimate.

### Sitemap priority rules (line 18 of sitemap.njk)
`/` → 1.0 · `/analyze/` → 0.9 · `/biomarkers/` index → 0.9 · `/biomarkers/*` → 0.8 · `/blog/*` → 0.7 · `/reviews/*` → 0.7 · `/guides/*` → 0.7 · `/compare/*` → 0.7 · `/search/` → 0.5 · everything else → 0.5

### .eleventy.js Filters
- `htmlDateString` — formats dates for sitemap.njk (ISO 8601)
- `initials` — generates avatar initials from a name (e.g. "Dan Carey" to "DC")

### Vercel Environment Variables
| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | api/analyze.js, api/digest.js | Claude API — set in Vercel dashboard |
| `ML_API_KEY` | api/subscribe.js | MailerLite API token |
| `DIGEST_KEY` | api/digest.js, api/gsc-ga4.js, api/gsc-setup.js | Secret string protecting /digest, /ops, /api/gsc-* endpoints |
| `STRIPE_SECRET_KEY` | api/stripe-checkout.js, api/stripe-verify.js | Live mode active May 19 2026 |
| `STRIPE_PRICE_ID` | api/stripe-checkout.js | Live price ID |
| `GOOGLE_SHEET_ID` | api/feedback.js, api/affiliate-click.js | Sheet ID from URL — AgelessLabs Feedback sheet: https://docs.google.com/spreadsheets/d/1B5kebMXzudqvlXMfkOG0kis9VnQrgAJ-vnDFxP3qm_0/edit |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | api/feedback.js, api/affiliate-click.js | Full JSON of Google service account key (agelesslabs-sheets@vocal-oarlock-497921-e7.iam.gserviceaccount.com) |
| `GOOGLE_CLIENT_ID` | api/gsc-ga4.js, api/gsc-setup.js | OAuth2 client ID for GSC/GA4 access |
| `GOOGLE_CLIENT_SECRET` | api/gsc-ga4.js, api/gsc-setup.js | OAuth2 client secret for GSC/GA4 access |
| `GOOGLE_REFRESH_TOKEN` | api/gsc-ga4.js | OAuth2 refresh token — regenerate via /api/gsc-setup?key=DIGEST_KEY if invalid_grant error occurs |

---

## Build & Deploy Commands

```bash
npm install        # First time only
npm start          # Local dev server (localhost:8080)
npm run build      # Production build to _site/ — runs Eleventy then Pagefind
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

**Reliable commit technique (updated July 15 2026):**
```javascript
// 1. Apply change via view.dispatch()
// 2. Release editor focus:
document.querySelector('.breadcrumb')?.click();
await new Promise(r => setTimeout(r, 1000));
// 3. Open commit dialog — button text is "Commit changes..." (with ellipsis):
const ob = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent.trim() === 'Commit changes...');
if (ob) ob.click();
// 4. WAIT ~3 SECONDS — the dialog mounts slowly. Querying too early finds nothing.
// 5. Locate the confirm button (shadow-DOM-aware traversal), then click its
//    coordinates with the computer tool:
function allButtons(root, acc) {
  root.querySelectorAll('*').forEach(el => {
    if (el.tagName === 'BUTTON') acc.push(el);
    if (el.shadowRoot) allButtons(el.shadowRoot, acc);
  });
  return acc;
}
const vis = allButtons(document, []).filter(b => {
  const r = b.getBoundingClientRect();
  return r.width > 0 && b.textContent.trim() === 'Commit changes';
});
// Click the returned coordinates via the computer tool
```
Never type commit messages while CodeMirror has focus — they go into the file.

**Confirm-click reliability note (added July 19–20 2026):** the first click on the confirm "Commit changes" button inside the dialog sometimes doesn't register (dialog stays open, no error shown). Always re-check `document.querySelector('[role="dialog"]')` after clicking — if still present, re-locate the button fresh (don't reuse cached coordinates) and click again, or fall back to `button.click()` via JS directly rather than simulated mouse coordinates.

**New file creation:** Use GitHub's new file editor (`/new/main/api` or `/new/main/src`) — inject content via `cm.cmTile.view` FIRST, then click the filename input and type the name LAST, then commit. **After typing the filename, always verify it via JS** (`document.querySelector('input[placeholder*="Name your file"]').value`) — typed text can land in the sidebar file-tree search instead of the filename input, and stray characters can leak in from keyboard shortcuts. With an empty filename the commit dialog silently fails.

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
| analyze.njk | Complete | AI tool — free + paid tiers live · dead `analyzePage` flag removed July 15 2026 · status pill colors updated to status-color-system July 19 2026 |
| biomarkers/index.njk | Complete | 66 markers, 5 categories, "Library Complete" banner |
| _includes/biomarker.njk | Complete | Layout template for all biomarker pages |
| blog/blog-index.njk | Complete | Placeholder — 6 content categories, priority post list |
| digest.njk | Complete | Key-protected community digest dashboard |
| get-tested.njk | Complete — updated July 15 2026 | All 5 affiliate links (4 Ulta + 1 Superpower) route through /api/affiliate-click · confirmed working live |
| email-thank-you.njk | Complete | Confirmation page — noindexed · live at /email-thank-you/ |
| longevity-lab-guide.njk | Complete — May 28 2026 | Email lead magnet — noindexed · live at /longevity-lab-guide/ |
| 404.njk | Complete — May 30 2026 | Custom 404 — outputs to /404.html · noindexed · excluded from sitemap |
| search.njk | Complete — May 31 2026 | Live at /search/ · Pagefind-powered · category badges · auto-focus · ?q= param |
| ops.njk | Complete — June 1 2026 | Ops/marketing dashboard — noindexed · live at /ops/ · key-protected · 5 sections: quick links, post composer, affiliate links, analytics (GSC + GA4), promotion checklist |
| reviews/index.njk | Complete — May 28 2026 | Reviews index — live at /reviews/ |
| reviews/ulta-lab-tests.njk | Complete — May 28 2026 | Live at /reviews/ulta-lab-tests/ · Review schema + FAQPage schema |
| reviews/superpower-health.njk | Complete — May 31 2026 | Live at /reviews/superpower-health/ · Review schema + FAQPage schema · 8.2/10 |
| reviews/function-health.njk | Complete — May 29 2026 | Live at /reviews/function-health/ · Review schema + FAQPage schema · 8.7/10 · no affiliate |
| guides/index.njk | Complete — May 30 2026 | Guides index — all 8 guides (3 Tier 2 + 5 Tier 3) |
| guides/best-longevity-blood-panel.njk | Complete — May 28 2026 | Live at /guides/best-longevity-blood-panel/ · Article + FAQPage schema |
| guides/blood-tests-men-over-40.njk | Complete — May 28 2026 | Live at /guides/blood-tests-men-over-40/ · Article + FAQPage schema |
| guides/blood-tests-women-over-40.njk | Complete — May 29 2026 | Live at /guides/blood-tests-women-over-40/ · Article + FAQPage schema |
| compare/longevity-blood-tests.njk | Complete — May 29 2026 | Live at /compare/longevity-blood-tests/ · Article + FAQPage schema · 6-service comparison |
| guides/how-to-lower-apob.njk | Complete — May 30 2026 | Live at /guides/how-to-lower-apob/ · Article + FAQPage schema · Ulta + Superpower CTAs |
| guides/how-to-improve-insulin-sensitivity.njk | Complete — May 30 2026 | Live at /guides/how-to-improve-insulin-sensitivity/ · Article + FAQPage schema · Ulta + Superpower CTAs |
| guides/how-to-optimize-testosterone.njk | Complete — May 30 2026 | Live at /guides/how-to-optimize-testosterone/ · Article + FAQPage schema · Ulta + Superpower CTAs |
| guides/how-to-reduce-inflammation.njk | Complete — May 30 2026 | Live at /guides/how-to-reduce-inflammation/ · Article + FAQPage schema · Ulta + Superpower CTAs |
| guides/how-to-fix-nutrient-deficiencies.njk | Complete — May 30 2026 | Live at /guides/how-to-fix-nutrient-deficiencies/ · Article + FAQPage schema · Ulta + Superpower CTAs |

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

### Feedback Feature — Complete (May 31 2026)
- **`api/feedback.js`** — Vercel serverless function. Appends rows to Google Sheet via service account JWT auth. Env vars: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` (full JSON string). No npm dependencies — uses Node.js built-ins + `crypto.subtle`.
- **FAB + popover in `base.njk`** — Flag icon FAB, lower-right corner. Toggle mechanism: `<input type="checkbox" id="feedbackToggle">` + `<label for="feedbackToggle">`. Popover shown/hidden via `#feedbackToggle:checked ~ .feedback-popover` CSS selector — no JS for open/close. On submit: form div hidden, thank-you div shown. Close button unchecks the checkbox. Hidden on `/digest/`. FAB and popover are direct children of `<body>`, outside `.container`.
- **Google Sheet** — "AgelessLabs Feedback" · https://docs.google.com/spreadsheets/d/1B5kebMXzudqvlXMfkOG0kis9VnQrgAJ-vnDFxP3qm_0/edit · Feedback tab columns: Timestamp, Page URL, Feedback. Service account shared as Editor.

### Affiliate Click Tracker — Phase 7.1a Complete (July 15 2026, confirmed working live)
- **`api/affiliate-click.js`** — Vercel serverless function. Receives `?partner=X&destination=URL-ENCODED-URL`, validates destination against an allowlist (ultalabtests.com, superpower.com, insidetracker.com, marekhealth.com — https only, prevents open-redirect abuse), optionally logs the click, then 302-redirects to the destination. Logging failures never block the redirect.
- **Exclusion logic (corrected from original spec):** skip logging when the referrer is EMPTY (bots/crawlers hitting the endpoint directly — e.g. Googlebot following the links) or when the referrer contains `/ops/` (dashboard test clicks). The original spec ("skip if referer includes agelesslabs.ai") would have excluded ALL legitimate clicks, since every real click originates from an agelesslabs.ai page. Dan's own clicks from regular site pages DO get logged — referrer-based filtering cannot distinguish them; accepted as rounding-error noise at current traffic. Add a `?self=1` bypass later if needed.
- **Sheet logging:** "Affiliate Clicks" tab in the AgelessLabs Feedback sheet · columns: Timestamp, Partner, Source Page (referrer pathname), Referrer (full URL), Destination. The tab is AUTO-CREATED with headers on the first logged click (batchUpdate addSheet + header row; handles "already exists" race). Same service account as feedback.js — no new credentials.
- **`src/get-tested.njk`** — all 5 affiliate links converted (3 Ulta panel CTAs, 1 inline Ulta text link, 1 Superpower). Destination URLs are URL-encoded — REQUIRED so query params like Superpower's `dub_id` survive.
- **Scope remaining:** 7.1b — 5 Tier 3 guide pages (~10 links) · 7.1c — biomarker pages (deferred, 66 pages) · ops dashboard clicks widget.

### Search Feature — Complete (May 31 2026)
- **Pagefind** — open-source static search. Build command: `eleventy && npx pagefind --site _site` in `package.json`. Index regenerates automatically on every Vercel deploy.
- **`src/search.njk`** — dedicated `/search/` page. Auto-focuses input on load. Reads `?q=` URL param and pre-populates + triggers search on arrival. Styled to match AgelessLabs design system.
- **Nav search icon** — desktop: magnifying glass icon in nav-right expands inline input, navigates to `/search/?q=query` on Enter or second icon click. Mobile: icon navigates directly to `/search/`. Implemented in `base.njk`.
- **Sticky nav** — `nav-sticky` class on nav element. CSS: `position: sticky; top: 0; z-index: 100; background: var(--bg); backdrop-filter: blur(8px)`.
- **Scroll offset** — `:target { scroll-margin-top: 72px }` in `styles.css` globally offsets anchor targets for sticky header.
- **Category metadata** — `data-pagefind-meta="category:VALUE"` on all content pages. Values: `Biomarker — [Subcategory]` (66 pages via biomarker.njk template), `Guide` (8 pages), `Review` (3 pages), `Comparison` (1 page).

### Analytics Feature — Complete (June 1 2026) · token regenerated July 21 2026
- **`api/gsc-ga4.js`** — Vercel serverless function. Protected by DIGEST_KEY. Uses OAuth2 refresh token flow (GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN). Fetches GSC top 10 pages by clicks (last 28 days) and GA4 top 10 pages by sessions (last 28 days). Returns combined JSON. **July 21 2026: refresh token had expired (`invalid_grant`); regenerated via the `/api/gsc-setup` flow and endpoint confirmed returning live data again.**
- **`api/gsc-setup.js`** — One-time OAuth2 setup endpoint. Visit `/api/gsc-setup?key=DIGEST_KEY` to initiate Google OAuth flow. On callback, displays refresh token for copy-paste into Vercel. Use this whenever `invalid_grant` errors occur to regenerate the refresh token.
- **Analytics section in `ops.njk`** — Two side-by-side cards: Top Pages (GSC clicks + impressions + CTR) and Top Pages (GA4 sessions + views). Loads automatically on dashboard unlock. Refresh button available.
- **OAuth2 setup:** Google Cloud project `vocal-oarlock-497921` · OAuth client `AgelessLabs GSC/GA4` · Authorized redirect URIs: `https://developers.google.com/oauthplayground` + `https://agelesslabs.ai/api/gsc-setup` · Test user: `dwcarey@gmail.com` · GA4 property `properties/532502940` · GSC site `https://agelesslabs.ai/`.

### Email Lead Magnet
Complete — May 28 2026. Live at `/longevity-lab-guide/`. Noindexed + excluded from sitemap. Delivered via MailerLite welcome sequence.

### Community Digest Tool
Complete — April 23 2026. Key-protected at `/digest`. Caching not built — generates live (~20s, ~$0.08/run).

**Reddit fetch fix — shipped July 19 2026 (`api/digest.js`, commit `727fd42`):** switched from `search.rss` (aggressively gated for datacenter/Edge IPs, returning zero results) to plain `new.rss` feeds per subreddit with local keyword-based topical filtering (`matchesKeywords` against the `KEYWORDS` list). Added an `after:YYYY-MM-DD` date constraint on rapamycin.news searches (last 7 days) so evergreen old threads stop dominating. Added `&debug=1` diagnostics mode returning per-source `status`/`entries`/`kept` counts. Bumped the biomarker count referenced in the Claude system prompt from the stale 18 to the current 66.

**Rate-limit fix (attempt 1) — shipped July 20 2026 (commit `bcf9595`):** debug-mode testing surfaced that firing all 3 subreddit `new.rss` requests concurrently (`Promise.allSettled`) from the same Edge IP tripped Reddit's rate limiter — 2 of 3 subreddits returned HTTP 429. Switched `fetchAllReddit` to sequential fetches staggered by 400ms via a `sleep()` helper. **This did NOT resolve the issue** — July 21 audit confirmed 2 of 3 subreddits still returned 429; the limiter trips after the very first request regardless of stagger delay.

**Rate-limit fix (real fix) — shipped July 21 2026 (commits `69314f0` + `d6620ed`):** replaced the per-subreddit request loop entirely with a single combined multi-subreddit feed: `/r/longevity+biohacking+PeterAttia/new.rss?limit=100` (Reddit supports joining subreddits with `+` in the path). One request instead of three means there is no request sequence to rate-limit. New `fetchRedditCombined()` extracts each entry's originating subreddit from its permalink to preserve per-subreddit weighting, and includes a `Retry-After`-aware backoff (up to 2 retries, capped at 5s) as a safety net. `limit` bumped from 75 → 100 (`d6620ed`) to give lower-volume subreddits more room to survive the cutoff. **Verified live via `?debug=1`: `reddit_combined` returns `status: 200`, zero 429s.** The old `fetchRedditSubreddit` and `fetchAllReddit` functions were removed.

**Known limitation — representation skew (July 21 2026):** the combined feed returns the most recent 100 posts *across all 3 subreddits pooled together*, so a high-volume subreddit (r/Biohacking, ~92 of 100 entries in testing) crowds out quieter ones (r/longevity, ~2 entries — despite being the highest-weighted at 1.0). Not a bug — it reflects real posting-volume differences. Bumping `limit` to 100 helped only marginally. If consistent r/longevity coverage matters, the fix is either score-weighting lower-volume subs more heavily, or running r/longevity as its own separate lightweight request (2 total requests, still clear of the rate limit that broke at 3). Deferred — flagged, not scoped.

### Design / CSS
**Palette rollout — shipped July 19 2026 (commit `5fa2d17` for `styles.css`, `546773c` for `analyze.njk`, `d264286` for `base.njk`).** Replaced the original near-black/near-white palette (16.6:1 contrast — technically AAA but caused halation/shimmer for older readers at thin font weights) with warm-dark Variant A. See **Brand Direction** below for live hex values. Also introduced a formal 3-color status system (optimal/monitor/concern) that fixed a live bug where `.status-monitor` in `analyze.njk` reused `var(--gold)`, making it visually indistinguishable from category labels. The `@media print` block in `analyze.njk` (paid PDF report) and `.score-value` were deliberately left untouched — confirmed intact post-edit.

**Pulsing period on wordmark — shipped July 20 2026 (commit `29838e6`, `styles.css` only).** The `.` in `.ai` now animates ivory (`--white`) → `--green-bright` (`#c8ddb4`) with a layered `text-shadow` (tight/medium/wide glow) on a 2.4s ease-in-out infinite cycle. `prefers-reduced-motion: reduce` disables the animation and holds resting ivory. No `base.njk` edit was needed — the `.dot` span already existed as a unique selector across all 3 wordmark instances (nav, footer, mobile menu). The animated dot never appears in the printed PDF since `nav, footer` are already `display: none` in the print stylesheet.

Dark theme only — re-evaluate if mobile bounce data warrants it. Watch Clarity/GA4 bounce-rate data over the following days to confirm the palette change helped as intended.

### Technical SEO
All complete. GSC verified + sitemap submitted April 21 2026.

### Analytics
GA4 (G-28CHRFJLKJ) + Microsoft Clarity (wa32lp8ja6) — both live on all page types. GA4 `purchase` event live and marked as key event — May 28 2026.

---

## Immediate Next Steps (Resume Here)

### Recently Shipped (July 21, 2026 — full audit session)

Full sweep of disconnected work from the prior weeks. Fixed the two items that were broken, verified the rest, and flagged what's outside scope.

**Fixed this session:**
1. **Reddit 429s — REAL fix (commits `69314f0` + `d6620ed`).** The July 20 stagger fix (`bcf9595`) did not work — audit confirmed 2 of 3 subreddits still 429'd. Replaced per-subreddit requests with a single combined `/r/longevity+biohacking+PeterAttia/new.rss?limit=100` feed + `Retry-After` backoff. Verified live: `status: 200`, zero 429s. See Community Digest Tool section for detail.
2. **GSC/GA4 refresh token — regenerated.** The `GOOGLE_REFRESH_TOKEN` had expired (`invalid_grant`), breaking the ops dashboard analytics widget. Dan re-ran `/api/gsc-setup?key=DIGEST_KEY`, logged in as `dwcarey@gmail.com`, pasted the new token into Vercel, redeployed. Verified live: `/api/gsc-ga4` returns full GSC + GA4 data. Token was then regenerated a second time to retire the copy that had appeared on-screen mid-session.

**Verified healthy (prior session's "still to verify" list — all now confirmed):**
- Palette rollout (Variant A + status colors) — homepage, biomarker page, analyze tool all render correctly live; no console errors.
- PDF print block in `analyze.njk` — confirmed untouched (`white` bg, `#2d6a2d` score color).
- All July 19–20 commits (`5fa2d17`, `546773c`, `d264286`, `29838e6`, `727fd42`, `bcf9595`) present and live.
- Affiliate Clicks sheet — logging correctly, `dub_id` surviving URL-encoding, partner/referrer capture intact. **Note:** last logged click was July 16 — 5 days quiet as of the audit. Probably low traffic; worth watching, not yet a problem.

**Flagged, no action taken (decisions for later):**
- **Digest representation skew** — combined feed lets r/Biohacking dominate; r/longevity underrepresented. Real volume difference, not a bug. See Community Digest Tool section.
- **`dc/tracker` fitness files in public repo history** — a personal weight-tracking tool ("Road to 200" / "Garage Iron") was created + deleted twice on July 13 2026 (`dc/tracker`, `tracker/index.html`). Fully removed from the current tree; never lived under `src/` so it never built to the live site. Noted only because it sat in the public repo's history undocumented.
- **Old `AgelessLabs-MasterPlan.md` (v1) still in repo root** — superseded by v2. Left in place per Dan's decision (he maintains v2 and copies it to Drive + GitHub manually; not deleting v1).
- **Clarity/GA4 bounce-rate** since the palette change — still worth watching over coming days.

### Phase 7.1b — Affiliate Click Tracker: Guide Pages (Next Session)

**Goal:** Extend tracked affiliate links to the 5 Tier 3 guide pages.

**Files (5 — one full session batch):**
1. `src/guides/how-to-lower-apob.njk`
2. `src/guides/how-to-improve-insulin-sensitivity.njk`
3. `src/guides/how-to-optimize-testosterone.njk`
4. `src/guides/how-to-reduce-inflammation.njk`
5. `src/guides/how-to-fix-nutrient-deficiencies.njk`

**Pattern (proven in 7.1a):** swap each Ulta/Superpower href to `/api/affiliate-click?partner=[ulta|superpower]&destination=[URL-ENCODED destination]`. Verify each href matches exactly once before dispatching the replacement. Keep `target="_blank" rel="noopener sponsored"`.

### Phase 7.1d — Ops Dashboard Affiliate Clicks Widget (after 7.1b)
Widget in `ops.njk`: top partners + top source pages, last 7 days, reading the "Affiliate Clicks" tab via the existing service account (new endpoint or extend `api/gsc-ga4.js` pattern).

### Phase 7.1c — Biomarker Pages (deferred)
66 pages — separate multi-session effort. Decide whether template-level change in `biomarker.njk` can convert all pages at once (links are per-page frontmatter — audit first).

---

### Phase 8 — Medical Review (deferred)
Decision (April 19 2026): Not a launch blocker. Revisit once affiliate revenue is consistent.

Candidates: Cynthia Thurlow NP · Jenni Gallagher MSN NP-C · Upwork fallback (NP/DNP functional medicine)

### Phase 9 — Course Product (deferred)
"How to Build a Money-Making Website with Claude." Don't launch until "here's what I made in month 3" story exists.

### Phase 10 — Next Site (deferred)
Apply AgelessLabs system to a new niche.

---

## Known Issues / Tech Debt

- **Digest caching not built** — generates fresh on every load (~20s, ~$0.08/run). Add Vercel KV + GitHub Actions cron when daily usage warrants it.
- **HTML entities in JSON-LD title strings** — low priority. Pages with `&#8212;` in title frontmatter have literal string in JSON-LD. Not a validity issue.
- **Vitamin K2 page note** — Ulta "vitamin-k" test measures total K (K1+K2 combined). Page accurately notes this and recommends ucOC as the functional K2 marker.
- **MailerLite v2 classic API** — `api/subscribe.js` uses `api.mailerlite.com/api/v2`. Classic API still functional but a newer API exists. Low urgency.
- **OG images not page-specific** — all pages share one `og-image.png`. Matters more once traffic and social sharing scale.
- **InsideTracker, OneTwenty, Marek Health affiliate applications** — follow-up emails needed, not code changes.
- **Trademark check at USPTO.gov** — not done.
- **Pagefind clear button** — cannot be replaced with a custom ✕ icon. Pagefind/Svelte rebuilds form DOM on every search, wiping injected elements. Currently styled as a DM Mono pill button.
- **Search not in sitemap** — `/search/` excluded from sitemap (standard practice). SearchAction schema in `base.njk` still points to biomarkers — update `urlTemplate` to `/search/?q={search_term_string}`.
- **GOOGLE_REFRESH_TOKEN expiry** — OAuth2 refresh tokens from a test-mode app can expire or be revoked. If `invalid_grant` errors appear in ops dashboard analytics, visit `/api/gsc-setup?key=DIGEST_KEY` to regenerate.
- **gsc-setup.js is a permanent utility** — keep in the repo; delete only after switching to a production-verified OAuth app or service account access.
- **Self-clicks on tracked affiliate links are logged** — Dan's own clicks from regular site pages appear in the Affiliate Clicks tab (only `/ops/` clicks and empty-referrer hits are excluded). Acceptable noise at current traffic; add a `?self=1` bypass or cookie flag if it becomes a problem.
- **Digest tool Reddit rate limiting — RESOLVED July 21 2026** via the combined-feed approach (single `/r/a+b+c/new.rss` request instead of 3, plus `Retry-After` backoff). The July 20 400ms stagger did NOT resolve it. Still monitor `?debug=1` periodically — if the single combined request ever 429s under load, the backoff should absorb it, but a hard failure would need investigation.
- **Digest representation skew** — the combined feed pools the most recent N posts across all subreddits, so high-volume subs crowd out quieter ones (r/longevity can drop to ~2 of 100 entries). Not yet addressed. Options if it matters: score-weight low-volume subs, or split r/longevity into its own request.

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
- **GitHub CodeMirror accessor** — use `cm.cmTile.view` (not `cm.cmView.view`). `cmTile` is the correct property in the GitHub editor environment.
- **GitHub new file commit pattern** — inject content via CodeMirror FIRST, type filename LAST, then commit. ALWAYS verify the filename input's value via JS after typing: typed text can land in the sidebar file-tree search instead of the filename field, and stray characters can leak in (e.g. from ctrl+a). With an empty filename the commit dialog silently fails.
- **GitHub commit dialog mounts slowly (~3s)** — after clicking "Commit changes...", wait ~3 seconds before querying for the confirm button; querying immediately finds nothing and looks like the dialog never opened. Use a shadow-DOM-aware button traversal, then click the confirm button's coordinates via the computer tool.
- **GitHub commit confirm click can silently fail to register (added July 19–20 2026)** — the first click on the confirm button inside the "Commit changes" dialog sometimes doesn't take effect (dialog stays open, no visible error). Always re-check `document.querySelector('[role="dialog"]')` after clicking; if still present, re-locate the button fresh and click again — don't reuse cached coordinates, and prefer `button.click()` via JS over simulated mouse coordinates if the first attempt fails.
- **Unauthenticated GitHub API rate limits** — verification via `api.github.com` from the sandbox gets rate-limited quickly, and the error body greps as "0 matches" (false negative). Verify committed files by fetching `raw.githubusercontent.com` with a cache-buster (`?cb=Date.now()`) from the browser tab instead.
- **Referrer-based self-click exclusion is impossible** — all legitimate affiliate clicks carry an agelesslabs.ai referrer, so "exclude own-domain referrers" excludes everything. Correct filters: skip EMPTY referrers (bots/crawlers) and `/ops/` referrers (dashboard testing). Same-origin requests send the full referrer URL under the default strict-origin-when-cross-origin policy, so the source page path is always capturable.
- **Affiliate tracker destination URLs must be URL-encoded** — unencoded query params in the destination (e.g. Superpower's `dub_id`) become params of the tracker endpoint and are lost.
- **Tracker endpoints need a destination allowlist** — an open redirect on agelesslabs.ai would be a spam/phishing vector. Validate hostname against known partner domains, https only.
- **Vercel deploy trigger** — committing only to `api/` may not trigger a Vercel deploy. Always commit a `src/` file change in the same session to guarantee a fresh deploy. (Observed exception July 20 2026: an `api/`-only commit *did* trigger its own deploy — behavior may not be perfectly consistent. Still safest to pair with a `src/` commit when possible.)
- **Vercel deploys can stall on GitHub-side incidents, not your code (added July 20 2026)** — a commit that shows "Initializing" for several minutes with no progress may be waiting on a GitHub Actions/API outage rather than a build problem. Check `githubstatus.com` before troubleshooting a stuck deploy; it will typically clear on its own once GitHub recovers.
- **Reddit new.rss rate limits — the request COUNT is the problem, not the timing (corrected July 21 2026)** — the limiter trips after the very first request from a shared Edge IP, so neither concurrent (`Promise.allSettled`) nor sequentially-staggered (400ms `sleep()`) per-subreddit requests fix it — the July 20 stagger fix failed in production. The working fix is to reduce the request count to ONE: use a combined `/r/sub1+sub2+sub3/new.rss` feed (Reddit joins subreddits with `+` in the path) and derive per-subreddit attribution from each entry's permalink. Add `Retry-After`-aware backoff as a safety net. Tradeoff: pooled results let high-volume subs crowd out quieter ones (see representation-skew note).
- **OAuth2 refresh token regeneration flow (walked through July 21 2026)** — the flow is: visit `/api/gsc-setup?key=DIGEST_KEY` → it 302-redirects to Google's consent → choose the `dwcarey@gmail.com` account → approve the 2 read-only scopes (Search Console + Analytics; click Advanced → proceed past the unverified-app warning, it's the project's own app) → the endpoint prints the refresh token on a dark page → paste into Vercel `GOOGLE_REFRESH_TOKEN` → redeploy. **Account selection and consent are the user's clicks — Claude cannot and should not enter Google credentials or approve consent.** Do the whole flow in a single tab the user opens themselves; running it through browser automation caused tab-context confusion (clicks landing on the general Google Account page instead of the consent screen). If the token is ever displayed on-screen in a shared session, regenerate it again afterward to retire the exposed copy.
- **OAuth2 refresh tokens from test-mode apps** — the OAuth Playground auto-revokes tokens after 24h unless using your own credentials AND the app is in production mode. Use `gsc-setup.js` endpoint to regenerate whenever needed.
- **GA4/GSC UI rejects service account emails** — Google's property UIs validate against Google Accounts; service account emails fail. Use personal Google account OAuth2 instead for GSC/GA4 API access.
- **Template literals with `${...}` in Vercel serverless functions** — can cause ES module parse failures when injected via CodeMirror into GitHub. Use string concatenation instead. (affiliate-click.js written entirely with concatenation.)
- **index.njk `layout: base.njk` critical** — this declaration gets silently dropped during batch edit sessions. Always verify it's present after any batch edit to biomarkers/index.njk.
- **Sitemap hardcoded `<url>` blocks** — must NEVER be placed inside or around the `collections.all` loop in sitemap.njk.
- **Title tag length** — target under 68 chars total including ` | AgelessLabs`.
- **Ulta + PubMed HTTP verification** — both block data center IPs (403). Browser extension also blocks navigation to ultalabtests.com. Manual spot-check from a real browser is the only reliable method.
- **checkout.stripe.com blocks browser extension navigation** — after Stripe redirect, open a new MCP tab via `tabs_create_mcp` to continue browser automation.
- **Nav dropdown button styling** — `.nav-dropdown-toggle` must explicitly set `font-family`, `font-size`, `letter-spacing`, `text-transform`, and `color` — browser button element defaults override inherited values from `.nav-link`.
- **Mobile viewport overflow on reload** — caused by any element wider than the viewport. Fix: `html { overflow-x: hidden }` + `flex-wrap: wrap` on the offending element.
- **Tier 3 guide template** — intervention table ranked by effect size with High/Medium/Low badges, phase-card protocol sequence, marker grid (3-col) for relevant biomarkers, test-cards for Ulta + Superpower CTAs, 6-question FAQ schema. All Tier 3 guides follow this pattern.
- **FAB toggle pattern** — use `<label for="checkbox">` + `<input type="checkbox">` for CSS-driven show/hide of fixed UI elements. Never use a `<button onclick>` as the trigger for a floating popover on mobile.
- **Google Sheets API via service account** — JWT auth using `crypto.subtle.importKey` (pkcs8, RSASSA-PKCS1-v1_5 SHA-256). Exchange JWT for OAuth2 token at `oauth2.googleapis.com/token`, then POST to Sheets append endpoint. No npm dependencies needed.
- **Google Sheets tab auto-creation** — append to a non-existent tab returns "Unable to parse range"; catch that, batchUpdate `addSheet`, then append header + data rows. Handle the "already exists" race on addSheet.
- **DIGEST_KEY** — shared password protecting `/digest/`, `/ops/`, and `/api/gsc-*`. Set in Vercel env vars.
- **Pagefind + Svelte DOM rebuilding** — Pagefind's UI is Svelte-compiled. It rebuilds its entire form DOM on every search event, wiping any elements injected into it. CSS overrides work; DOM injection does not survive re-renders.
- **CSS-only animation for brand micro-interactions** — the wordmark pulsing period used a pure CSS `@keyframes` + `animation` property rather than JS, keeping it lightweight and automatically respecting `prefers-reduced-motion` via a media query override. Preferred pattern for small, always-on decorative animations.
- **Reassembling a rewritten file from past-chat search results** — when a file was rewritten in a prior session but not yet committed, pulling the exact code back from conversation history is workable but exact-match string replacements against the live file are safer than reconstructing and pasting the whole file from memory-of-search-results. Always `node --check` (or equivalent) syntax-validate before pushing, and diff key markers (function names, new logic) against the live file post-edit.

---

## Near-Future Enhancements

Items to build in future sessions. Not yet prioritized or scheduled.

| # | Enhancement | Notes |
|---|---|---|
| 1 | Content freshness schedule | Regular review cadence, update triggers, SEO/LLM freshness signals. |
| 2 | News section vs. page-level updates | Decision pending. Lean toward updating existing pages until traffic warrants a standalone blog. |
| 3 | Navigation improvements | Broader pass — clearer labeling, mobile nav refinement, potentially surfacing the AI tool more prominently. |
| 4 | Sitewide readability review | Text, font sizes, color contrast — especially on mobile. |
| 5 | SearchAction schema update | Update `urlTemplate` in base.njk WebSite schema to point to `/search/?q={search_term_string}` instead of `/biomarkers/`. |

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
- **Aesthetic:** Warm dark green, DM Mono for labels/data, Red Hat Display for headings
- **Color palette (live — Variant A, shipped July 19 2026):**
  - Background `#1a261c` (warm dark green, was `#111210`)
  - Body text `#ddc9a3` (warm tan, was `#d4dece`)
  - Headings / key numbers `#f0e9d9` (warm ivory, was `#eef2ea`)
  - Gold (labels/CTAs) `#d8b87a` (was `#c8a96e`)
  - Sage green (brand, unchanged) `#b5c9a0`
  - Status trio: optimal `#7ecb8c` · monitor `#ecab3e` · concern `#e5766a`
  - Secondary backgrounds: `--bg2` `#202e23` · `--bg3` `#26362a`
- **Theme:** Dark only (no light theme). The July 2026 palette refinement addressed halation/shimmer from the original near-black/near-white combo (16.6:1 contrast — technically passed WCAG but was uncomfortable for older readers at thin font weights) without abandoning the dark aesthetic that differentiates AgelessLabs from generic light wellness-brand sites. Re-evaluate theme direction only if Clarity/GA4 bounce data warrants it.
- **Wordmark:** Red Hat Display, lowercase, bold/light weight split (`ageless`=700, `labs`=300, `.ai`=300 in ivory). Kept as-is after a full exploration of Title Case and alternate fonts (Fraunces, Space Grotesk, Instrument Serif/Sans, Sora, Bricolage Grotesque, Familjen Grotesk, Unbounded, IBM Plex Sans, Gabarito) — direct side-by-side comparison confirmed the original is still the stronger mark. Icon (hourglass/helix) stays a standalone asset, not combined with the wordmark inline (tried before, hurt readability). Pulsing period on `.ai`'s dot shipped July 20 2026 — breathes ivory → `--green-bright` with layered glow on a 2.4s cycle, respects `prefers-reduced-motion`.
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
| New file or heavily rewritten file | GitHub new file editor (/new/main/api or /new/main/src) via CodeMirror (`cm.cmTile.view`) |
| Master plan updates | Downloadable artifact, Dan uploads to project manually |
| Never | Drive MCP for .njk or .js files (silent truncation above ~3KB) |

### Rule 4 — Flag resource-intensive paths before starting
More than 8 tool calls → stop, state requirements, propose batching plan, get approval.

### Rule 5 — Confirm completed work before updating the master plan
Status entries not marked Complete until file is verified.

### Rule 6 — When in doubt, ask
One clarifying question before starting ambiguous tasks.

### Rule 7 — Ask before assuming platform/browser context
Before writing any platform-specific fix (touch events, iOS quirks, browser-specific CSS), ask which browser and OS the user is on. Never assume.

### Rule 8 — Two failed patches = revert, not more patches
If a feature isn't working after 2 targeted fixes to `base.njk` or any shared layout file, stop patching. Revert to the last known-good commit for that specific file, then rebuild cleanly from scratch.

---

## Content Strategy

### Serving Three Masters
1. **Please search engines & AI agents** — structured, semantically rich content
2. **Be genuinely useful to humans** — real depth, honest analysis
3. **Drive revenue** — tool CTAs, affiliate links, paid report upsells

### Content Architecture

#### Tier 1 — Biomarker Reference Library — COMPLETE (66 pages)
All 66 pages complete across Waves 1–9. Do not add more biomarker pages.

#### Tier 2 — Lab Test Comparison & Buyer's Guide Pages — COMPLETE (7 of 7)
All 7 pages live. InsideTracker, OneTwenty, and Marek Health links in the comparison page are non-affiliate direct links pending approval.

#### Tier 3 — Protocol & Optimization Guides — COMPLETE (5 of 5)
All 5 guides live at `/guides/how-to-[slug]/`. `guides/index.njk` updated with all 8 guides.

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

*AgelessLabs.ai — Master Project Plan · July 2026*
