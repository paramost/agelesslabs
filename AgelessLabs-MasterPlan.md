# AgelessLabs.ai — Master Project Plan

> Single source of truth. Replaces all prior planning notes.
> Last updated: May 26, 2026 · 12:00 PM CST

---

## The Business

AgelessLabs.ai is a longevity-focused content site with an integrated AI biomarker interpreter tool. The content builds organic SEO traffic. The AI tool converts that traffic into revenue. Both drive affiliate income from lab testing companies.

**Domain:** AgelessLabs.ai (primary) · AgelessLabs.com (redirect — owned by someone else, expires October 2026)
**Tagline:** Understand what your labs reveal about how long you'll live.
**Status:** Live, indexed, and fully SEO/LLM-clean — ready for Google Search Console submission

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

| Company | Product | Est. Commission |
|---|---|---|
| InsideTracker | Blood testing + analysis platform | $30–60 per sale |
| Ulta Lab Tests | À la carte blood tests | 5–8% per order |
| Life Extension | Supplements + lab tests | 8–12% |
| Marek Health | Longevity-focused lab panels | TBD — affiliate application pending approval |
| SiPhox Health | At-home finger-prick testing | TBD |
| Mito Health | Biomarker + biological age scoring | TBD |

---

## The Core Product — AI Biomarker Interpreter

The centerpiece of AgelessLabs.ai. A free tool that analyzes lab results through a longevity lens, converting visitors into engaged users and driving affiliate recommendations naturally.

### Free Tier
- User uploads PDF/image or pastes lab results
- AI returns a longevity score (0–100), per-marker breakdown with status (optimal / monitor / concern), narrative summary, and top recommendations
- Affiliate lab testing recommendations embedded in results

### Paid Tier — Full Longevity Report ($19 one-time) — Not yet built
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
│   └── digest.js             # Vercel Edge function — community digest (Reddit + rapamycin.news)
├── .eleventy.js              # 11ty config — filters, collections, passthrough, dirs
├── package.json              # npm scripts: build, start, dev
├── vercel.json               # buildCommand, outputDirectory: _site
└── src/
    ├── _includes/
    │   ├── base.njk          # Single shared layout: head, nav, mobile menu, footer, scripts
    │   └── biomarker.njk     # Biomarker page template — all 18 pages use this
    ├── biomarkers/
    │   ├── index.njk         # Biomarker library index — all 18 markers, 5 categories
    │   ├── apob.njk          # Live — indexed
    │   ├── hba1c.njk         # Live — indexed
    │   ├── hscrp.njk         # Live — indexed
    │   ├── vitamin-d.njk     # Live — indexed
    │   ├── testosterone.njk  # Live — indexed
    │   ├── homocysteine.njk  # Live — indexed
    │   ├── ferritin.njk      # Live — indexed
    │   ├── tsh.njk           # Live — indexed
    │   ├── igf-1.njk         # Live — indexed
    │   ├── fasting-insulin.njk # Live — indexed
    │   ├── triglycerides.njk # Live — indexed
    │   ├── omega-3-index.njk # Live — indexed
    │   ├── ldl-hdl.njk       # Live — indexed
    │   ├── cortisol.njk      # Live — indexed
    │   ├── uric-acid.njk     # Live — indexed
    │   ├── creatinine-egfr.njk # Live — indexed
    │   ├── albumin.njk       # Live — indexed
    │   └── lipoprotein-a.njk # Live — indexed
    ├── blog/
    │   └── blog-index.njk    # Blog placeholder — 6 categories, priority post list
    ├── index.njk             # Homepage
    ├── about.njk             # About page
    ├── analyze.njk           # AI tool page
    ├── digest.njk            # Community digest dashboard — key-protected, noindexed
    ├── privacy.njk           # Privacy policy
    ├── disclaimer.njk        # Disclaimer + affiliate disclosure
    ├── sitemap.njk           # Auto-generates /sitemap.xml
    ├── styles.css            # Global stylesheet (passthrough to _site)
    ├── favicon.svg           # Favicon (passthrough to _site)
    ├── og-image.png          # OG image 1200x630 (passthrough to _site)
    ├── robots.txt            # 12 crawlers + AI agents explicitly permitted
    └── llms.txt              # AI agent site description — all 18 biomarker URLs listed
```

### Key Conventions
- **Nav and footer** defined once in `src/_includes/base.njk` — edit there, propagates to all pages
- **Mobile menu** lives in `base.njk` — full-screen overlay, slides in from right, styles inline in `<style>` block in head, JS inline before `</body>`
- **Mobile menu email slot** — placeholder already structured in base.njk; email form drops into the `{# email capture form goes here #}` comment inside `.mobile-menu-email-slot`
- **Biomarker pages** use `layout: biomarker.njk` in frontmatter (NOT base.njk directly)
- **All other pages** use `layout: base.njk` in frontmatter
- **analyze.njk** uses `analyzePage: true` in frontmatter — swaps "Try Free" nav CTA for "Beta" badge
- **Page-specific styles** go in a style block at the top of the page file
- **Biomarker index and blog index** use `eleventyExcludeFromCollections: true`
- **Biomarker pages** no longer use `noindex: true` — all 18 fully indexed as of April 20 2026
- **og-image.png** uses a hyphen — og-image.png, not ogimage.png
- **Arrow characters** in index cards use `&#8594;` HTML entity — NOT the Unicode arrow, which mojibakes in the GitHub editor
- **base.njk must have `---\n---` (empty frontmatter with closing delimiter)** — a single opening `---` with no closing causes gray-matter to parse the entire HTML file as YAML, crashing the build when it hits `"@context": "https://schema.org"`

### .eleventy.js Filters
- `htmlDateString` — formats dates for sitemap.njk (ISO 8601)
- `initials` — generates avatar initials from a name (e.g. "Dan Carey" to "DC")

### Vercel Environment Variables
| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | api/analyze.js, api/digest.js | Claude API — set in Vercel dashboard |
| `ML_API_KEY` | api/subscribe.js | MailerLite API token |
| `DIGEST_KEY` | api/digest.js | Secret string protecting the /digest endpoint |

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

**GitHub editing via browser:** Claude edits files directly in the GitHub web editor using CodeMirror 6 automation. Access via `document.querySelector('.cm-content').cmTile.view`. Use `view.dispatch({ changes: { from, to, insert } })` to make programmatic edits. Navigate directly to edit URL: `github.com/paramost/agelesslabs/edit/main/[path]`.

### Google Drive — Working Files
**Folder:** AgelessLabs > Source Files
**Link:** `drive.google.com/drive/folders/1bwGF_oT6_XsbHoFBViRyYGZQlM6jPz3Z`

Drive is a staging area, not a backup. Drive MCP limitation: files larger than ~3KB may upload truncated. For the master plan, produce as a downloadable file and upload manually.

### Workflow for File Changes
1. Claude fetches current file from GitHub (raw URL)
2. Claude makes changes, saves updated file to Drive
3. You copy content from Drive into the repo at the correct path
4. You push to GitHub — Vercel auto-deploys

For small targeted edits, Claude can edit directly in the GitHub web editor via browser automation — faster than Drive staging for one-line changes.

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
| analyze.njk | Complete | AI tool — free tier live |
| biomarkers/index.njk | Complete | Pillar page — all 18 markers, 5 categories, schema; all 18 cards active |
| _includes/biomarker.njk | Complete | Layout template for all biomarker pages |
| blog/blog-index.njk | Complete | Placeholder — 6 content categories, priority post list, tool CTA |
| digest.njk | Complete | Key-protected community digest dashboard — April 23 2026 |
| get-tested.njk | Complete — May 21 2026 | "Get Your Baseline" page — Group B visitors (no GP/labs). 3 panel options, marker table, FAQ, tool CTA. Live at /get-tested |

### Biomarker Pages (First Wave — 18 pages)
All 18 pages are **live and indexed** as of April 20, 2026. Full SEO/LLM audit completed April 21, 2026 — all pages clean.

| Page | Status | Notes |
|---|---|---|
| biomarkers/apob.njk | Complete | April 16 2026 — longevity optimal: <60 mg/dL |
| biomarkers/hba1c.njk | Complete | April 17 2026 — longevity optimal: <5.3% |
| biomarkers/hscrp.njk | Complete | April 17 2026 — longevity optimal: <0.5 mg/L |
| biomarkers/vitamin-d.njk | Complete | April 18 2026 — longevity optimal: 50-80 ng/mL |
| biomarkers/testosterone.njk | Complete | April 18 2026 — longevity optimal: 600-900 ng/dL (men) |
| biomarkers/homocysteine.njk | Complete | April 19 2026 — longevity optimal: <7 umol/L |
| biomarkers/ferritin.njk | Complete | April 19 2026 — longevity optimal: 50-100 ng/mL. Rewritten April 21 2026: YAML entities → Unicode, Ulta URL fixed |
| biomarkers/tsh.njk | Complete | April 19 2026 — longevity optimal: TSH 1.0-2.0 mIU/L. Rewritten April 21 2026: YAML entities → Unicode, Ulta URL fixed |
| biomarkers/igf-1.njk | Complete | April 19 2026 — longevity optimal: 120-180 ng/mL (age-adj.). Ulta URL fixed April 21 2026 |
| biomarkers/fasting-insulin.njk | Complete | April 19 2026 — longevity optimal: <6 uIU/mL. Ulta URL fixed April 21 2026 |
| biomarkers/triglycerides.njk | Complete | April 19 2026 — longevity optimal: <80 mg/dL. Ulta URL fixed April 21 2026 |
| biomarkers/omega-3-index.njk | Complete | April 19 2026 — longevity optimal: >8%. Ulta URL fixed April 21 2026 |
| biomarkers/ldl-hdl.njk | Complete | April 19 2026 — LDL <70 mg/dL, HDL 50-80 mg/dL. Rewritten April 21 2026: Ulta URL fixed, YAML entities → Unicode |
| biomarkers/cortisol.njk | Complete | April 19 2026 — AM: 10-18 ug/dL, strong diurnal decline |
| biomarkers/uric-acid.njk | Complete | April 19 2026 — longevity optimal: <5.5 mg/dL |
| biomarkers/creatinine-egfr.njk | Complete | April 19 2026 — eGFR >90 |
| biomarkers/albumin.njk | Complete | April 19 2026 — longevity optimal: 4.5-5.0 g/dL |
| biomarkers/lipoprotein-a.njk | Complete | April 19 2026 — longevity optimal: <30 mg/dL |

### Tool
| Item | Status |
|---|---|
| AI tool — free tier | Complete — all 3 upload types tested April 21 2026 |
| Model string | claude-sonnet-4-6 |
| PDF upload + extraction | Complete — extracts text silently, no tab switch |
| Image upload | Complete |
| Serverless proxy (api/analyze.js) | Complete — April 21 2026 |
| Anthropic API key + credits | Complete — $20 loaded April 21 2026 |
| Paid tier ($19 report) | Complete — May 19 2026 |
| Stripe integration | Complete — live mode active May 19 2026 |
| Email capture | Complete — migrated to MailerLite May 19 2026. Group: AgelessLabs Subscribers (ID 187945335219291618). ML_API_KEY in Vercel. Confirmed working. Welcome sequence pending build. |

### Community Digest Tool
| Item | Status |
|---|---|
| api/digest.js — Edge function | Complete — April 23 2026 |
| src/digest.njk — dashboard UI | Complete — April 23 2026 |
| Reddit fetching (r/longevity, r/biohacking, r/PeterAttia) | Complete — RSS/Atom via Edge runtime (Cloudflare IPs) |
| rapamycin.news fetching | Complete — Discourse search JSON API |
| Relevance scoring | Complete — keyword match + recency + engagement |
| Claude draft generation | Complete — claude-sonnet-4-6, 8 drafts per run |
| Key-protected endpoint | Complete — DIGEST_KEY env var |
| Digest caching | Not built — currently generates live on every load (~20s, ~$0.08/run). Add Vercel KV + GitHub Actions cron when daily usage warrants it |

### Design / CSS
| Item | Status |
|---|---|
| Dark theme (persistent, no toggle) | Complete — revisit if mobile bounce rate is high |
| Light theme removed | Complete |
| Logo consistent across all pages | Complete |
| CSS consolidated into styles.css | Complete |
| Nav/footer links readable | Complete |
| Footer standardized across pages | Complete |
| Favicon | Complete |
| Body copy font weight 300 to 400 | Complete |
| Biomarkers link added to nav | Complete |
| Contact link added to footer | Complete |
| Font sizes bumped sitewide for 35–65 mobile audience | Complete — April 22 2026 (styles.css) |
| Biomarker card font sizes + color contrast improved | Complete — April 22 2026 (biomarkers/index.njk) |
| Mobile hamburger menu | Complete — April 22 2026 (base.njk) |
| Mobile container padding tightened (32px → 20px at 600px) | Complete — April 22 2026 (styles.css) |

### Technical SEO
| Item | Status |
|---|---|
| OG tags + Twitter Card in base.njk | Complete |
| Canonical link in base.njk | Complete |
| Robots meta in base.njk | Complete — dynamic noindex/index flag |
| `<title>` tag using `| safe` filter | Complete — fixed April 21 2026 |
| Organization + WebSite schema (JSON-LD) in base.njk | Complete |
| Biomarker page schema (MedicalWebPage, Article, FAQPage, BreadcrumbList) | Complete — fully audited and validated April 21 2026 |
| All YAML frontmatter variables output via `| safe` in biomarker.njk | Complete — fixed April 21 2026 |
| Broken Ulta Lab Tests URLs fixed across all 18 pages | Complete — April 21 2026 |
| robots.txt — 12 crawlers + AI agents explicitly permitted | Complete — updated April 20 2026 |
| llms.txt — AI agent site description with all 18 biomarker URLs | Complete — updated April 20 2026 |
| OG image — 1200x630 (og-image.png) | Complete |
| Sitemap — generated at /sitemap.xml (23 URLs) | Complete |
| Full SEO/LLM front-end audit — all 25 pages clean | Complete — April 21 2026 |
| Google Search Console — domain verified | Complete — April 21 2026 |
| Sitemap submitted to GSC | Complete — April 21 2026 |

### Analytics & Tracking
| Item | Status |
|---|---|
| GA4 | Complete — G-28CHRFJLKJ |
| Microsoft Clarity | Complete — wa32lp8ja6 |

---

## Immediate Next Steps (Resume Here)

### Phase 1 — Technical Foundation — Complete
### Phase 2 — Site Structure — Complete
### Phase 3 — Write All Content — Complete
### Phase 4 — Public Launch — Complete
### Phase 4.5 — SEO/LLM Hardening — Complete (April 21 2026)

Full audit completed. All 18 biomarker pages and 7 supporting pages pass clean: no visible entities, no broken URLs, valid JSON-LD schema on all pages, all `index, follow`. Google Search Console verified and sitemap submitted April 21 2026.

### Phase 4.6 — AI Tool QA — Complete (April 21 2026)

Root cause of "Something went wrong" error identified: direct browser-to-API calls blocked by CORS. Fixed by adding Vercel serverless proxy (`api/analyze.js`). Anthropic API key created and $20 credits loaded. `max_tokens` bumped 1000 → 2000 to prevent JSON truncation on large panels. PDF tab-switch jarring UX removed — PDF text now extracted silently. All three upload paths tested and confirmed working: ✅ Paste text · ✅ Image (JPG/PNG) · ✅ PDF

### Phase 4.7 — Mobile Readability — Complete (April 22 2026)

Font sizes bumped sitewide for 35–65 mobile audience. Biomarker card text (.bmi-card-desc 12px → 16px) and color contrast (.bmi-card-desc --text-muted → --text-dim) significantly improved. Mobile container padding tightened. Mobile hamburger menu built into base.njk — full-screen slide-in overlay with large tap targets, social icons, and pre-structured email capture slot ready for form insertion.

### Phase 4.8 — Email Capture — Complete (April 22 2026)

Kit (ConvertKit) was original email provider but trial expired May 8 2026. Migrated to MailerLite May 19 2026. MailerLite free plan (up to 1,000 subscribers, full automations). Group: "AgelessLabs Subscribers" (ID: 187945335219291618). Vercel env var: `ML_API_KEY`. Custom form in homepage and mobile menu submits via `api/subscribe.js` → MailerLite API. Confirmed working. Welcome sequence to be rebuilt in MailerLite automation builder.

### Biomarker Pages — Wave 2 (May 25 2026)
6 new pages written and live:
- `alt-ast.njk` → `/biomarkers/alt-ast` ✅
- `magnesium.njk` → `/biomarkers/magnesium` ✅
- `vitamin-b12.njk` → `/biomarkers/vitamin-b12` ✅
- `dhea-s.njk` → `/biomarkers/dhea-s` ✅
- `psa.njk` → `/biomarkers/psa` ✅
- `free-testosterone.njk` → `/biomarkers/free-testosterone` ✅

`biomarkers/index.njk` updated: 6 new cards added (ALT/AST→Metabolic, Magnesium+B12→Nutrients, DHEA-S+PSA+Free T→Hormonal), schema updated to 24 items, stats bar updated. `llms.txt` and `sitemap.njk` updated with 6 new URLs.

**Wave 3 — Complete (May 25, 2026):**
- `shbg.njk` → `/biomarkers/shbg` ✅
- `estradiol.njk` → `/biomarkers/estradiol` ✅
- `ggt.njk` → `/biomarkers/ggt` ✅
- `fibrinogen.njk` → `/biomarkers/fibrinogen` ✅
- `cystatin-c.njk` → `/biomarkers/cystatin-c` ✅
- `folate.njk` → `/biomarkers/folate` ✅

`biomarkers/index.njk` updated: 6 new cards added (SHBG+Estradiol→Hormonal, GGT+Cystatin C→Metabolic, Fibrinogen→Cardiovascular, Folate→Nutrients), duplicate card bugs from Wave 2 fixed, schema updated to 30 items, stats bar updated. `llms.txt` and `sitemap.njk` updated with 6 new URLs.

**Wave 4 — Complete (May 25, 2026):**
- `apolipoprotein-a1.njk` → `/biomarkers/apolipoprotein-a1` ✅
- `zinc.njk` → `/biomarkers/zinc` ✅
- `cbc.njk` → `/biomarkers/cbc` ✅
- `selenium.njk` → `/biomarkers/selenium` ✅
- `hs-troponin.njk` → `/biomarkers/hs-troponin` ✅
- `tmao.njk` → `/biomarkers/tmao` ✅

`biomarkers/index.njk` updated: 6 new cards added (ApoA1+hs-Troponin+TMAO→Cardiovascular, CBC→Metabolic, Zinc+Selenium→Nutrients), schema updated to 36 items, stats bar updated to 36, "Wave 5" coming soon section. `llms.txt` and `sitemap.njk` updated with 6 new URLs.

**Wave 5 — Complete (May 25, 2026):**
- `lp-pla2.njk` → `/biomarkers/lp-pla2` ✅
- `adiponectin.njk` → `/biomarkers/adiponectin` ✅
- `leptin.njk` → `/biomarkers/leptin` ✅
- `coenzyme-q10.njk` → `/biomarkers/coenzyme-q10` ✅
- `galectin-3.njk` → `/biomarkers/galectin-3` ✅
- `nmr-lipoprofile.njk` → `/biomarkers/nmr-lipoprofile` ✅

`biomarkers/index.njk` updated: 6 new cards added (Lp-PLA2+Galectin-3+NMR Lipoprofile→Cardiovascular, Adiponectin+Leptin→Metabolic, CoQ10→Nutrients), schema updated to 42 items, stats bar updated to 42, "Wave 6" coming soon section. `llms.txt` and `sitemap.njk` updated with 6 new URLs.

**Wave 6 — next session (resume here):**

Original suggested Wave 6 (NT-proBNP, Urine Microalbumin, Hepcidin, HDL Subfractions, Oxaloacetate, Alpha-2-Macroglobulin) was audited against three criteria — doctor test, affiliate test, search test — and rejected. Most failed on affiliate availability and/or are research territory.

**Revised Wave 6 list (all pass all three criteria):**
- `iron-tibc.njk` → `/biomarkers/iron-tibc` — Iron/TIBC, serum iron, transferrin saturation; highest-searched nutrient topic; Ulta carries it
- `progesterone.njk` → `/biomarkers/progesterone` — Biggest gap in hormonal category; every women's panel; high perimenopause search volume
- `c-peptide.njk` → `/biomarkers/c-peptide` — Best companion to fasting insulin page; pancreatic output; metabolic health circles
- `vitamin-a.njk` → `/biomarkers/vitamin-a` — Standard nutritional panel; Ulta carries it; immune/longevity depth
- `il-6.njk` → `/biomarkers/il-6` — Attia's most-cited inflammatory marker beyond hsCRP; Function Health includes it; growing search volume. **Verify Ulta availability before building** — may not be offered à la carte.
- `prolactin.njk` → `/biomarkers/prolactin` — Ordered on hormonal optimization panels for men and women; Ulta carries it; connects to testosterone/SHBG pages

**Waves 7–8 (planned, pending Wave 6 completion):**

Wave 7 candidates: FSH (biggest single gap — perimenopause audience), Fasting Glucose (highest search volume of anything missing), Free T3/Free T4 (standalone; captures thyroid search traffic TSH page misses), DHT (men's hormone optimization; connects to testosterone cluster), ALP (completes liver panel alongside ALT/AST and GGT), Calcium (completes basic metabolic panel)

Wave 8 candidates: Reverse T3, Vitamin K2, LH (or FSH/LH combined)

**Stopping rule:** Waves 1–8 total ~57 pages — at the floor of the 60–80 target. After Wave 8, pivot to Tier 2 content (lab test comparison pages) and Tier 3 (protocol guides), which have higher conversion value per page.

**Biomarker criteria for any future pages:**
1. Doctor test — would a functional medicine/longevity doctor order this?
2. Affiliate test — available to order from Ulta, InsideTracker, or Function Health?
3. Search test — consumer-level search interest (not research territory)?

Community monitoring and reply-drafting tool built. `api/digest.js` (Vercel Edge function) fetches Reddit (r/longevity, r/biohacking, r/PeterAttia) via RSS/Atom + rapamycin.news via Discourse JSON API, scores posts by keyword relevance + recency + engagement, and generates Claude draft replies for the top 8 posts. Dashboard at `/digest` is key-protected (`DIGEST_KEY` env var), renders post cards with stats and copy buttons. Runs on-demand (~20s load time). Reddit required Edge runtime (Cloudflare IPs) to bypass IP blocks on standard Vercel Node servers.

### Phase 5 — Monetization — IN PROGRESS

1. **Thank-you page** (`/email-thank-you`) ✅ Complete — April 24 2026.
2. **Welcome email series** ✅ Complete — April 24 2026. ⚠️ **Kit trial expired ~May 8 — upgrade immediately to restore automation.**
3. **Drive early traffic** — community digest tool is live at `/digest`; use it daily to find reply opportunities on Reddit + rapamycin.news. Twitter/X longevity community is link-friendly from day one. Reddit playbook doc produced April 25 2026.
4. **Paid tier ($19 report)** ✅ Complete — May 19 2026. Stripe live mode active. All 18 Ulta affiliate links wired into AFFILIATE config in analyze.njk. Function Health affiliate links still pending.

### Phase 5.5 — Full Site Audit — Complete (May 19 2026)

All live files audited and verified. Fixes applied directly to GitHub via Claude in Chrome browser automation:
- All 18 biomarker pages: Ulta affiliate URLs updated to `/partners/agelesslabs/test/[slug]` format
- biomarkers/index.njk: All 18 cards flipped from `coming-soon` → `available`, badges removed, arrows added, LDL schema URL fixed
- apob.njk: `noindex: true` removed, Ulta URL corrected
- lipoprotein-a.njk: Ulta URL corrected
- Live site confirmed rendering correctly on agelesslabs.ai
- Claude in Chrome extension connected — direct GitHub repo access established for all future sessions

**Remaining items from audit (resume here):**
1. **MailerLite welcome sequence** ✅ Complete — May 21 2026. 5-email automation built, header/footer designed, sequence activated. Trigger: joins AgelessLabs Subscribers group. Sender: `news@agelesslabs.ai` / Reply-to: `hello@agelesslabs.ai`. Header: `AgelessLabs.ai` text. Footer: company name, address, unsubscribe link.
2. **MailerLite domain authentication** ✅ Complete — May 20 2026. DKIM, SPF, and domain verification all confirmed working. Spacemail mailboxes active at `hello@agelesslabs.ai` and `news@agelesslabs.ai`.
3. **Panel affiliate links** — add Longevity & Healthy Aging Essential Panel and Basic Health Profile (Men's/Women's) to AFFILIATE config and homepage. These are high-value CTAs for Group B visitors (no GP, no labs).

### Phase 5.6 — Ulta Affiliate URL Audit — IN PROGRESS (May 26 2026)

All 24 Wave 2–5 Ulta à la carte URLs were extracted directly from live GitHub files and verified by clicking. 11 of 24 were broken (guessed slugs that didn't match Ulta's actual URL structure). Correct slugs found via web search against Ulta's live site — no assumptions.

**Batch 1 — Complete (May 26 2026) — 6 files committed to main:**

| File | Old slug (broken) | New slug (confirmed) |
|---|---|---|
| vitamin-b12.njk | `vitamin-b12` | `vitamin-b12-test` |
| dhea-s.njk | `dhea-sulfate` | `dhea-s-test` |
| shbg.njk | `sex-hormone-binding-globulin` | `sex-hormone-binding-globulin-shbg` |
| ggt.njk | `gamma-glutamyltransferase-ggt` | `gamma-glutamyl-transferase-ggt` |
| fibrinogen.njk | `fibrinogen-activity` | `fibrinogen-activity-clauss` |
| cystatin-c.njk | `cystatin-c` | `cystatin-c-with-egfr` |

**Batch 2 — Pending (next session) — 5 files:**

| File | Old slug (broken) | New slug (confirmed) |
|---|---|---|
| cbc.njk | `complete-blood-count-with-differential` | `complete-blood-count-with-differential-and-platelets-cbc-test` |
| hs-troponin.njk | `troponin-i-high-sensitivity` | `troponin-t-high-sensitivity-hs-tnt` |
| tmao.njk | `tmao` | `tmao-trimethylamine-n-oxide` |
| lp-pla2.njk | `lp-pla2` | `lp-pla2-activity` |
| nmr-lipoprofile.njk | `nmr-lipoprofile` | `lipoprotein-fractionation-test-nmr` |

**13 Wave 2–5 URLs confirmed correct (no changes needed):**
ALT/AST (`hepatic-function-panel`), Magnesium (`magnesium`), PSA (`psa-total-test`), Free Testosterone (`testosterone-free-and-total-test`), Estradiol (`estradiol`), ApoA1 (`apolipoprotein-a1`), Zinc (`zinc`), Selenium (`selenium`), Lp-PLA2 mass (`lp-pla2-activity`), Adiponectin (`adiponectin`), Leptin (`leptin`), CoQ10 (`coenzyme-q10`), Galectin-3 (`galectin-3`)

#### Paid Report Spec — $19 one-time

**What the paid report includes (vs. free tier):**
- Full clinical context per marker — research-backed interpretation at the user's specific level, not just status flags
- Marker interactions — cross-panel pattern recognition (e.g. fasting insulin + triglycerides + HDL flagged together as metabolic syndrome signal)
- Age and sex-adjusted ranges — optimal targets that shift based on user's age and sex
- Prioritized action plan — ranked 3–5 highest-leverage interventions with expected impact and timeline
- "What to test next" — specific missing tests identified from panel gaps, with affiliate links to order them
- Downloadable PDF — via browser print, print CSS included
- Affiliate links in two places only: "what to test next" section (specific tests tied to actual gaps) and one comprehensive panel CTA at end if significant gaps exist (Ulta Longevity & Healthy Aging Essential Panel)

**Files built — April 26 2026:**
- `api/stripe-checkout.js` ✅ — creates Stripe Checkout session, redirects to Stripe
- `api/stripe-verify.js` ✅ — validates completed Stripe session before unlocking report
- `src/analyze.njk` ✅ — updated with full payment flow, paid report rendering, affiliate link config, PDF download
- `package.json` ✅ — `"stripe": "^14.0.0"` added (missing comma bug fixed April 26 2026)

**Payment flow:**
Free results → "Unlock Full Report — $19" → Stripe Checkout → payment → redirect to `/analyze?session_id=xxx` → verify → paid analysis runs → full report renders + PDF download

**Stripe config — LIVE MODE (May 19 2026):**
- Live Price ID: set in Vercel `STRIPE_PRICE_ID`
- Vercel env vars: `STRIPE_SECRET_KEY` ✅ live, `STRIPE_PRICE_ID` ✅ live
- Test card (sandbox only): `4242 4242 4242 4242`, any future expiry, any CVC

**Ulta affiliate links — all 18 confirmed (May 19 2026):** Format is `ultalabtests.com/partners/agelesslabs/test/[slug]`. Drop into AFFILIATE config object in analyze.njk.

| Biomarker | Ulta Affiliate URL |
|---|---|
| ApoB | https://www.ultalabtests.com/partners/agelesslabs/test/apolipoprotein-b |
| HbA1c | https://www.ultalabtests.com/partners/agelesslabs/test/hemoglobin-a1c-hgba1c |
| hsCRP | https://www.ultalabtests.com/partners/agelesslabs/test/hs-crp |
| Vitamin D | https://www.ultalabtests.com/partners/agelesslabs/test/vitamin-d-25-hydroxy-total-immunoassay |
| Testosterone | https://www.ultalabtests.com/partners/agelesslabs/test/testosterone-total-male-test-adult-only |
| Homocysteine | https://www.ultalabtests.com/partners/agelesslabs/test/homocysteine |
| Ferritin | https://www.ultalabtests.com/partners/agelesslabs/test/ferritin |
| TSH + Free T3/T4 | https://www.ultalabtests.com/partners/agelesslabs/test/thyroid-health-test-package-tsh-ft4-and-ft3 |
| IGF-1 | https://www.ultalabtests.com/partners/agelesslabs/test/igf-1-test |
| Fasting Insulin | https://www.ultalabtests.com/partners/agelesslabs/test/insulin |
| Triglycerides | https://www.ultalabtests.com/partners/agelesslabs/test/triglycerides |
| Omega-3 Index | https://www.ultalabtests.com/partners/agelesslabs/test/omegacheck-test |
| LDL/HDL | https://www.ultalabtests.com/partners/agelesslabs/test/lipid-panel |
| Cortisol | https://www.ultalabtests.com/partners/agelesslabs/test/cortisol-am-test |
| Uric Acid | https://www.ultalabtests.com/partners/agelesslabs/test/uric-acid |
| Creatinine/eGFR | https://www.ultalabtests.com/partners/agelesslabs/test/creatinine |
| Albumin | https://www.ultalabtests.com/partners/agelesslabs/test/albumin-test |
| Lp(a) | https://www.ultalabtests.com/partners/agelesslabs/test/lipoprotein-a |

**Function Health affiliate links:** Still pending — gather separately.

### Phase 7 — Course Product (deferred — resume when AgelessLabs is generating consistent revenue)

Build and sell a course teaching the AgelessLabs system as a replicable model. Working title: "How to Build a Money-Making Website with Claude."

**The system being taught:**
Content site + free AI tool + email capture + paid report + affiliate links

**The niche is the fill-in-the-blank part.** The course teaches the model — student brings their own niche and applies the system. Much larger addressable market than a longevity-specific course.

**What makes it differentiated:** most "build with AI" content teaches using AI to write blog posts. This teaches building an AI tool that IS the product — a fundamentally different and more valuable concept.

**Course components:**
- Niche selection framework (the criteria that made longevity work: data-rich domain, affluent audience, high-value affiliates, questions people need help answering)
- Site architecture — 11ty + Vercel + Claude API
- Content strategy — pillar pages, SEO structure, schema markup
- AI tool integration — the serverless proxy pattern, prompt engineering
- Email capture and welcome sequence
- Community traffic — Reddit playbook
- Monetization — affiliate structure + Stripe paid reports

**Format:** course + template bundle. Codebase stripped of AgelessLabs branding, biomarker page templates replaced with generic content page templates, email sequences, master plan format.

**Price point:** $197–$497 depending on depth and community component.

**Timing note:** include real revenue numbers from AgelessLabs — credibility is the product. Don't launch the course until there's a "here's what I made in month 3" story to tell.

---

### Phase 8 — Next Site (deferred — resume when AgelessLabs is generating consistent revenue)

Apply the AgelessLabs system to a new niche. Brainstorm niche candidates when ready — evaluate each against the criteria: data-rich domain, affluent audience, high-value affiliate partners, questions people genuinely need help answering.

The master plan format, codebase, and workflow developed for AgelessLabs become the starting template for the next site.

---

### Phase 6 — Medical Review (deferred — resume when site is generating revenue)

Decision (April 19 2026): Not a launch blocker. Revisit once affiliate revenue is consistent. Reviewer adds E-E-A-T signal for competitive head-term SEO — important for Year 1 scale, not for early traffic and revenue.

5. **Recruit medical reviewer** — NP or DNP with longevity/functional medicine background

Candidate 1: Cynthia Thurlow, NP — cynthiathurlow.com · @cynthia_thurlow_ on Instagram · Board-certified NP, cardiology + metabolic health background. Note: book launching April 28 2026, may be busy.

Candidate 2: Jenni Gallagher, MSN, NP-C — linkedin.com/in/fnpjennigallagher · Functional medicine, endocrinology, metabolic health. Director of Elite NP Functional Medicine Certification. More accessible than Thurlow.

Fallback: Post on Upwork for NP/DNP with functional medicine background.

6. **Reviewer reviews live indexed pages** — accesses via direct URL on agelesslabs.ai
7. **Incorporate feedback** — update content, ranges, citations as needed
8. **Add reviewer byline** — name + credentials added to each page's reviewer block
9. **Announce** — social, email, community posts flagging the expert review

---

## Known Issues / Tech Debt

- **Function Health** — unresponsive to affiliate program outreach. Removed from all code and plan. May revisit if they respond.
- **Panel affiliate links** ✅ Complete — May 21 2026. Ulta Longevity & Healthy Aging Essential Panel ($158.95) featured as "Start Here" on all 18 biomarker pages and homepage. Ulta à la carte card on homepage updated to correct affiliate URL.
- **"Get Your Baseline" content page** ✅ Complete — May 21 2026. Live at `/get-tested`. Longevity panel, men's/women's basic panels, marker table, FAQ, tool CTA. "Get Tested" added to desktop nav and mobile menu.
- **Digest caching not built** — `/digest` generates fresh on every load (~20s, ~$0.08/run). Fine for occasional use. Add Vercel KV + GitHub Actions cron when daily usage warrants it.
- **Drive old flat files** — stale flat copies in Drive root. Can be deleted manually. GitHub is clean.
- **HTML entities in JSON-LD title strings** — low priority. Pages with `&#8212;` in title frontmatter have that literal string in JSON-LD. Not a validity issue.
- **Ulta affiliate URL audit — Batch 2 pending** — 5 Wave 4–5 files still have broken Ulta à la carte slugs. Fix in next session. Correct slugs documented in Phase 5.6 above.

---

## Key Learnings & Principles

- **YAML frontmatter duplicate keys cause silent build failures** — specifically duplicate permalink keys; always audit frontmatter when builds fail unexpectedly.
- **base.njk robots meta should be dynamic**, not static — use a Nunjucks conditional: emit noindex, follow when noindex: true is in frontmatter, index, follow otherwise.
- **Biomarker pages use layout: biomarker.njk** with prose-only body content — the layout handles all structural/schema elements. Don't duplicate schema in individual page files.
- **Stray files in content directories** can interfere with builds — audit directory contents when unexpected behavior occurs.
- **Arrow characters** in index cards must use &#8594; HTML entity — the Unicode arrow mojibakes in the GitHub editor.
- **Biomarker files belong in src/biomarkers/** — files placed in src/ directly won't be included in the 11ty biomarkers collection.
- **AgelessLabs master plan timestamps must include time, not just date.**
- **`{{ variable | dump }}` inside JSON-LD script blocks requires `| safe`** — without it, Nunjucks HTML-escapes the output, turning `"` into `&quot;` and producing invalid JSON that Google cannot parse. Always use `{{ variable | dump | safe }}` for all variables inside JSON-LD blocks in .njk templates.
- **All YAML frontmatter variables output in HTML require `| safe`** — Nunjucks auto-escapes `&` to `&amp;`, so HTML entities like `&#8212;` in YAML become `&amp;#8212;` and render as literal text. Apply `| safe` to all prose output variables in biomarker.njk: `definition`, `why_it_matters`, `standard_range`, `longevity_optimal`, `longevity_notes`, `standard_unit`, `also_known_as`, `takeaways` items, `faq.question`, `faq.answer`, `test.badge`, `test.note`. Also applies to `{{ biomarker | dump | safe }}` in the JSON-LD breadcrumb (the `&` in "LDL & HDL" otherwise escapes to `&amp;`).
- **YAML source files should use plain Unicode characters, not HTML entities** — `—` not `&#8212;`, `–` not `&#8211;`, `·` not `&#183;`, `À` not `&#192;`. HTML entities belong in HTML body sections, not YAML frontmatter strings.
- **base.njk must use `---\n---` (two delimiter lines) for its frontmatter** — a single opening `---` with no closing delimiter causes gray-matter to treat the entire HTML file as YAML. It parses silently until hitting JSON-LD (`"@context": "https://schema.org"`), which is valid YAML syntax and triggers a fatal parse error at build time. Layout files with no frontmatter variables must still use a closing `---`.
- **`<title>{{ title | safe }}</title>` in base.njk** — the title tag requires `| safe` to prevent double-escaping of HTML entities in page titles. OG/Twitter meta `content=""` attributes do NOT need `| safe` (HTML attribute context handles entities correctly).
- **The Claude API cannot be called directly from browser JS** — `api.anthropic.com` blocks cross-origin requests. Always route API calls through a Vercel serverless function (`api/analyze.js`) which adds the `x-api-key` header server-side. The `ANTHROPIC_API_KEY` env variable must be set in Vercel dashboard and requires a redeploy to take effect.
- **Anthropic API billing is separate from Claude.ai subscriptions** — a Claude.ai Pro/Max plan does not grant API credits. Credits must be purchased separately at `platform.claude.com/settings/billing`. New API keys created before credits are purchased may need to be regenerated after funding.
- **`max_tokens: 1000` is too low for a full longevity panel** — 13+ biomarkers with descriptions generates ~3,500 tokens, truncating the JSON mid-response. Use `max_tokens: 2000` minimum for the analyzer.
- **PDF upload should not force a tab switch** — extracting PDF text into the textarea and calling `switchTab('paste')` is jarring UX. Instead, populate `labInput` silently and keep the user on the Upload tab. The analysis function reads `labInput` regardless of active tab.
- **MailerLite API for subscriber capture** — Use the v2 classic API: `POST https://api.mailerlite.com/api/v2/subscribers` with `X-MailerLite-ApiKey` header. Body: `{ email, groups: [groupId], resubscribe: true }`. Successful response includes `data.id`. Always route through Vercel serverless proxy (`api/subscribe.js`) — never call from browser directly. Env var: `ML_API_KEY`.
- **MailerLite group ID** — AgelessLabs Subscribers group ID: `187945335219291618`. Found in the URL when viewing the group in the MailerLite dashboard.
- **Kit → MailerLite migration** — Kit doubled pricing in Sept 2025 to $33/mo. MailerLite free plan covers 1,000 subscribers with full automations. Switching cost was ~30 min: rewrite `api/subscribe.js`, add Vercel env var, create group. No frontend changes needed.
- **Spacemail + Vercel DNS** — domain registered at Spaceship, nameservers pointing to Vercel. MX records must use `mx1.spacemail.com` / `mx2.spacemail.com` (not `mx1.efwd.spaceship.net`). SPF must include `include:spf.spacemail.com` for outbound Spacemail sending. Spaceship shows "NEEDS DNS SETUP" when nameservers are external — click Verify DNS changes after adding records to Vercel.
- **MailerLite sender email** — use `news@agelesslabs.ai` for bulk sends, `hello@agelesslabs.ai` as reply-to. Both mailboxes active in Spacemail. Domain authenticated in MailerLite (DKIM + SPF + verification TXT all in Vercel DNS).
- **Mobile menu styles live inline in base.njk** — in a `<style>` block in `<head>`, not in styles.css. This keeps the menu self-contained in one file. JS lives inline just before `</body>`. If styles.css grows unwieldy, migrate mobile menu CSS there.
- **Mobile menu email slot pre-structured** — `.mobile-menu-email-slot` in base.njk contains a Nunjucks comment `{# email capture form goes here #}`. Drop the form HTML there when email capture is built. No restructuring needed.
- **Reddit's public JSON API blocks Vercel Node.js server IPs** — standard `fetch()` from a Vercel serverless function to `reddit.com` returns a 403 or times out. Two working approaches: (1) Vercel Edge runtime (`export const config = { runtime: 'edge' }`) runs on Cloudflare's network which Reddit does not block; (2) Reddit OAuth API (`oauth.reddit.com`) works from any server with valid credentials but requires app registration at reddit.com/prefs/apps. Edge + RSS is the simpler approach when credentials aren't needed.
- **Reddit RSS/Atom feeds work without credentials** — `https://www.reddit.com/r/{subreddit}/search.rss?q=...` returns Atom XML with title, link, content, and upvote count. No app registration required. Parse with regex — no XML library needed for the predictable Atom structure Reddit uses.
- **Vercel Edge runtime uses the Web API response format** — Edge functions return `new Response(body, { status, headers })` rather than the Node.js `res.status().json()` pattern. `process.env` still works. No `Buffer` — use `btoa()` for base64.
- **Ulta Lab Tests URL slugs are not predictable from test names** — never guess Ulta slugs. Always verify by searching `site:ultalabtests.com [test name]` and reading the actual URL from search results before writing it into any file. The affiliate path format is `ultalabtests.com/partners/agelesslabs/test/[slug]` where `[slug]` must match Ulta's exact slug. Common mismatches: `dhea-sulfate` → `dhea-s-test`; `cystatin-c` → `cystatin-c-with-egfr`; `complete-blood-count-with-differential` → `complete-blood-count-with-differential-and-platelets-cbc-test`; `nmr-lipoprofile` → `lipoprotein-fractionation-test-nmr`.
- **Biomarker page criteria for deciding what to build** — three tests before writing any new biomarker page: (1) Doctor test: would a functional medicine/longevity doctor order this? (2) Affiliate test: can someone actually order it from Ulta, InsideTracker, or Function Health? (3) Search test: consumer-level search interest (not research territory)? All three must pass. Beyond ~57 pages (Waves 1–8), pivot to Tier 2/3 content.

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

These rules exist to prevent mid-task failures, wasted tool calls, and broken intermediate states. Claude must follow them in every session.

### Rule 1 — Plan before touching files

Before starting any task that involves more than one file, Claude must:
1. State the full plan: every file to be touched, what changes will be made, in what order
2. Get explicit approval from Dan before proceeding
3. Execute one file at a time, confirming completion before moving to the next

**No exceptions.** Starting a multi-file task without approval is prohibited.

### Rule 2 — Batch multi-file tasks at 6 files maximum per session

Any task spanning more than 6 files must be split across sessions. Claude proposes the batches upfront, completes the first batch, confirms success, then stops. Dan opens a new session for the next batch.

Rationale: context limits cause silent mid-task failures on large batches. Smaller confirmed batches are faster in practice than one large failed attempt.

### Rule 3 — File delivery method by task type

| Task type | Method | Reason |
|---|---|---|
| Small targeted edit (<20 lines, 1–2 files) | GitHub direct edit via browser automation | Fastest, no intermediary |
| New file or heavily rewritten file | Downloadable artifact in chat | Skips Drive, no truncation risk |
| Master plan updates | Downloadable artifact, Dan uploads to Drive manually | Drive MCP truncates large files |
| Never | Drive MCP for .njk or .js files | Silent truncation above ~3KB |

### Rule 4 — Flag resource-intensive paths before starting

If a task will require more than 8 tool calls (fetches, edits, uploads), Claude must stop and say so before beginning. State: what the task requires, how many tool calls are estimated, and propose a batching plan. Get approval before proceeding.

### Rule 5 — Confirm completed work before updating the master plan

The master plan is updated last — after files are produced and confirmed correct, not speculatively. Status entries are not marked Complete until the file is verified.

### Rule 6 — When in doubt, ask

If a task scope is ambiguous, Claude asks one clarifying question before starting. A 10-second clarification is cheaper than a half-completed task.

---

## Content Strategy

### Serving Three Masters

Every piece of content must satisfy all three simultaneously:

1. **Please search engines & AI agents** — structured, semantically rich content that earns organic rankings and gets cited by AI models.
2. **Be genuinely useful to humans** — real depth, honest analysis, and information people actually want to share and cite.
3. **Drive revenue** — tool CTAs, affiliate links, and paid report upsells woven in naturally.

### Content Architecture

#### Tier 1 — Biomarker Reference Library
One page per biomarker. The backbone of organic and AI traffic. Target: ~57 pages across Waves 1–8 (then stop and pivot).

First wave (18 markers) — complete:
ApoB, HbA1c, hsCRP, Vitamin D, Testosterone, Homocysteine, Ferritin, TSH/T3/T4, IGF-1, Fasting Insulin, Triglycerides, Omega-3 Index, LDL/HDL, Cortisol, Uric Acid, Creatinine/eGFR, Albumin, Lipoprotein(a)

#### Tier 2 — Lab Test Comparison & Buyer's Guide Pages
Priority: InsideTracker vs Function Health vs Ulta (definitive comparison), best at-home blood tests, best tests for men/women over 40.

#### Tier 3 — Protocol & Optimization Guides
Categories: Metabolic Health, Cardiovascular, Hormonal Health, Inflammation & Immune, Nutrient Optimization.

### Content Quality Standards
- Minimum 1,200 words for biomarker pages; 1,800+ for guides
- At least 2 links to primary research (PubMed, clinical studies)
- One comparison table where applicable
- FAQ section at end (minimum 3 Q&As, FAQ schema)
- Tool CTA embedded at least once mid-article
- Affiliate link where contextually appropriate (never forced)
- Meta description optimized for click-through and AI extraction

*AgelessLabs.ai — Master Project Plan · May 2026*
