# AgelessLabs.ai — Master Project Plan

> Single source of truth. Replaces AgelessLabsProjectPlanv2.pdf and all prior planning notes.
> Last updated: April 19, 2026 · 8:30 PM CST

---

## The Business

AgelessLabs.ai is a longevity-focused content site with an integrated AI biomarker interpreter tool. The content builds organic SEO traffic. The AI tool converts that traffic into revenue. Both drive affiliate income from lab testing companies.

**Domain:** AgelessLabs.ai (primary) · AgelessLabs.com (redirect — owned by someone else, expires October 2026)
**Tagline:** Understand what your labs reveal about how long you'll live.
**Status:** Foundation complete — content buildout in progress

**Target audience:** Health-conscious adults aged 35–65 who track biomarkers, spend on diagnostics and supplements, and are serious about longevity optimization.

---

## Revenue Streams

| Stream | Status | Notes |
|---|---|---|
| Affiliate commissions from lab testing partners | Live (links in place) | Primary revenue driver |
| AI report upgrade — $19 one-time | Not yet built | Stripe integration needed |
| Display advertising | Deferred | Later stage, once traffic scales |

---

## Affiliate Partners

| Company | Product | Est. Commission |
|---|---|---|
| InsideTracker | Blood testing + analysis platform | $30–60 per sale |
| Function Health | Comprehensive lab panel | $50–100 per sale |
| Ulta Lab Tests | À la carte blood tests | 5–8% per order |
| Life Extension | Supplements + lab tests | 8–12% |
| Marek Health | Longevity-focused lab panels | TBD |
| SiPhox Health | At-home finger-prick testing | TBD |
| Mito Health | Biomarker + biological age scoring | TBD |

---

## The Core Product — AI Biomarker Interpreter

The centerpiece of AgelessLabs.ai. A free tool that analyzes lab results through a longevity lens, converting visitors into engaged users and driving affiliate recommendations naturally.

### Free Tier
- User uploads PDF/image or pastes lab results
- AI returns a longevity score (0–100), per-marker breakdown with status (optimal / monitor / concern), narrative summary, and top recommendations
- Affiliate lab testing recommendations embedded in results

### Paid Tier — Full Longevity Report ($19 one-time) — *Not yet built*
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
| Payments | Stripe | Not yet integrated |
| Hosting | Vercel | Auto-deploys from GitHub on push to main |
| Template language | Nunjucks (.njk) | Single base layout, pages extend it |

### Why 11ty
Static site generator that handles templating and content at scale without framework overhead. Nav, footer, and head are defined once in `base.njk` — a change touches one file, not every page. Scales to 80+ content pages without friction. Output is plain static HTML; Vercel deployment unchanged. If server-side features are needed later (user accounts, saved reports), a backend can be added via Vercel serverless functions without replacing 11ty.

---

## Project Structure

```
agelesslabs/
├── .eleventy.js              # 11ty config — filters, collections, passthrough, dirs
├── package.json              # npm scripts: build, start, dev
├── vercel.json               # buildCommand, outputDirectory: _site
└── src/
    ├── _includes/
    │   ├── base.njk          # Single shared layout: head, nav, footer, scripts
    │   └── biomarker.njk     # Biomarker page template — all 18 pages use this
    ├── biomarkers/
    │   ├── index.njk         # Biomarker library index — all 18 markers, 5 categories
    │   ├── apob.njk          # ✅ Live, noindexed
    │   ├── hba1c.njk         # ✅ Live, noindexed
    │   ├── hscrp.njk         # ✅ Live, noindexed
    │   ├── vitamin-d.njk     # ✅ Live, noindexed
    │   ├── testosterone.njk  # ✅ Live, noindexed
    │   └── homocysteine.njk  # ✅ Live, noindexed
    ├── blog/
    │   └── blog-index.njk    # Blog placeholder — 6 categories, priority post list
    ├── index.njk             # Homepage
    ├── about.njk             # About page
    ├── analyze.njk           # AI tool page
    ├── privacy.njk           # Privacy policy
    ├── disclaimer.njk        # Disclaimer + affiliate disclosure
    ├── sitemap.njk           # Auto-generates /sitemap.xml
    ├── styles.css            # Global stylesheet (passthrough to _site)
    ├── favicon.svg           # Favicon (passthrough to _site)
    ├── og-image.png          # OG image 1200×630 (passthrough to _site)
    ├── robots.txt            # All crawlers + AI agents explicitly permitted
    └── llms.txt              # AI agent site description
```

### Key Conventions
- **Nav and footer** are defined once in `src/_includes/base.njk` — edit there, propagates to all pages
- **Biomarker pages** use `layout: biomarker.njk` in frontmatter (NOT base.njk directly)
- **All other pages** use `layout: base.njk` in frontmatter
- **analyze.njk** uses `analyzePage: true` in frontmatter — this swaps the "Try Free" nav CTA for the "Beta" badge
- **Page-specific styles** go in a `<style>` block at the top of the page file, before the content HTML
- **Biomarker index and blog index** use `eleventyExcludeFromCollections: true` to prevent index pages bleeding into their own collections
- **Biomarker pages** use `noindex: true` in frontmatter while awaiting medical review. base.njk robots meta reads this flag and emits `noindex, follow` until cleared
- **og-image.png** uses a hyphen — `og-image.png`, not `ogimage.png`
- **Arrow characters** in index cards use `&#8594;` HTML entity — NOT the Unicode `→` character, which mojibakes to `â` in the GitHub editor

### .eleventy.js Filters
- `htmlDateString` — formats dates for sitemap.njk (ISO 8601 date string)
- `initials` — generates avatar initials from a name (e.g. "Dan Carey" → "DC"), used in biomarker.njk author/reviewer blocks

---

## Build & Deploy Commands

```bash
npm install        # First time only
npm start          # Local dev server with live reload (localhost:8080)
npm run build      # Production build → _site/
```

Vercel auto-builds on push to main. Build command: `npm run build`. Output: `_site/`.

---

## Development Tooling & Workflow

### Claude Project
All development work happens inside the **AgelessLabs Claude Project**. The project has access to key source files. Start every session by saying *"Where are we?"* — Claude will read the project files and resume from the current status.

### GitHub Repository
**Repo:** `github.com/paramost/agelesslabs` (public)

The GitHub repo is the source of truth and the primary backup. Every push is versioned — you can roll back to any commit. Claude can fetch any file directly from GitHub using raw URLs:
```
https://raw.githubusercontent.com/paramost/agelesslabs/main/src/[path/to/file]
```

**GitHub fetch gotcha:** Navigate to `https://github.com/paramost/agelesslabs` first to establish domain context before fetching raw URLs — cold raw URL fetches fail.

### Google Drive — Working Files
**Folder:** AgelessLabs → Source Files
**Link:** `drive.google.com/drive/folders/1bwGF_oT6_XsbHoFBViRyYGZQlM6jPz3Z`

Drive is a **staging area, not a backup.** When Claude produces or modifies a file, it saves the updated version to this folder. You copy the content from Drive into the repo and push. Drive always reflects the most recent version of files Claude has touched.

**Drive folder structure** mirrors the repo:
```
Source Files/
├── .eleventy.js
├── AgelessLabs-MasterPlan.md
└── src/
    ├── _includes/
    │   └── base.njk
    └── biomarkers/
        ├── index.njk
        ├── apob.njk
        ├── hba1c.njk
        ├── hscrp.njk
        ├── vitamin-d.njk
        ├── testosterone.njk
        └── homocysteine.njk
```

**Drive MCP limitation:** Files larger than ~3KB cannot be reliably uploaded via the Drive MCP API — they upload truncated or fail. GitHub is the source of truth; Drive is used for staging new files written during a session.

### Workflow for File Changes
1. Claude fetches current file from GitHub (raw URL)
2. Claude makes changes, saves updated file to Drive (`src/biomarkers/` or appropriate subfolder)
3. You copy content from Drive into the repo file at the correct path
4. You push to GitHub → Vercel auto-deploys

---

## Current Build Status

### Infrastructure
| Item | Status |
|---|---|
| Domain — AgelessLabs.ai | ✅ Live |
| Domain — AgelessLabs.com | ⏳ Acquire when expires October 2026 |
| Social handles — Twitter/X + Instagram | ✅ Secured |
| Trademark check at USPTO.gov | ❌ Not done |
| Google Search Console | ❌ Not verified |
| GitHub repo | ✅ Set up (public) |
| Vercel hosting | ✅ Live |
| 11ty migration | ✅ Complete |

### Pages
| Page | Status | Notes |
|---|---|---|
| index.njk | ✅ Complete | Homepage with hero, how-it-works, lab test affiliates |
| about.njk | ✅ Complete | Mission, principles, values grid, named founder (Dan Carey) |
| privacy.njk | ✅ Complete | Privacy policy |
| disclaimer.njk | ✅ Complete | Disclaimer + affiliate disclosure |
| analyze.njk | ✅ Complete | AI tool — free tier live |
| biomarkers/index.njk | ✅ Complete | Pillar page — all 18 first-wave markers, 5 categories, schema; 6 cards active |
| _includes/biomarker.njk | ✅ Complete | Layout template for all biomarker pages |
| blog/blog-index.njk | ✅ Complete | Placeholder — 6 content categories, priority post list, tool CTA |

### Biomarker Pages (First Wave — 18 pages)
All pages are **noindexed** until medical reviewer signs off. Published to live site for reviewer access only.

| Page | Status | Notes |
|---|---|---|
| biomarkers/apob.njk | ✅ Complete | April 16 2026 — longevity optimal: <60 mg/dL |
| biomarkers/hba1c.njk | ✅ Complete | April 17 2026 — longevity optimal: <5.3% |
| biomarkers/hscrp.njk | ✅ Complete | April 17 2026 — longevity optimal: <0.5 mg/L |
| biomarkers/vitamin-d.njk | ✅ Complete | April 18 2026 — longevity optimal: 50–80 ng/mL |
| biomarkers/testosterone.njk | ✅ Complete | April 18 2026 — longevity optimal: 600–900 ng/dL (men) |
| biomarkers/homocysteine.njk | ✅ Complete | April 19 2026 — longevity optimal: <7 µmol/L |
| biomarkers/ferritin.njk | ✅ Complete | April 19 2026 — longevity optimal: 50–100 ng/mL |
| biomarkers/tsh.njk | ✅ Complete | April 19 2026 — longevity optimal: TSH 1.0–2.0 mIU/L |
| biomarkers/igf-1.njk | ✅ Complete | April 19 2026 — longevity optimal: 120–180 ng/mL (age-adj.) |
| biomarkers/fasting-insulin.njk | ✅ Complete | April 19 2026 — longevity optimal: <6 µIU/mL |
| biomarkers/triglycerides.njk | ✅ Complete | April 19 2026 — longevity optimal: <80 mg/dL |
| biomarkers/omega-3-index.njk | ✅ Complete | April 19 2026 — longevity optimal: >8% |
| biomarkers/ldl-hdl.njk | ✅ Complete | April 19 2026 — LDL <70 mg/dL · HDL 50–80 mg/dL |
| biomarkers/cortisol.njk | ✅ Complete | April 19 2026 — AM: 10–18 µg/dL, strong diurnal decline |
| biomarkers/uric-acid.njk | ✅ Complete | April 19 2026 — longevity optimal: <5.5 mg/dL |
| biomarkers/creatinine-egfr.njk | ✅ Complete | April 19 2026 — eGFR >90 |
| biomarkers/albumin.njk | ✅ Complete | April 19 2026 — longevity optimal: 4.5–5.0 g/dL |
| biomarkers/lipoprotein-a.njk | ✅ Complete | April 19 2026 — longevity optimal: <30 mg/dL |

### Tool
| Item | Status |
|---|---|
| AI tool — free tier | ✅ Complete |
| Model string | ✅ claude-sonnet-4-6 |
| PDF upload + extraction | ✅ Complete |
| Image upload | ✅ Complete |
| Paid tier ($19 report) | ❌ Not started |
| Stripe integration | ❌ Not started |
| Email capture | ❌ Not started |

### Design / CSS
| Item | Status |
|---|---|
| Dark theme (persistent, no toggle) | ✅ Complete |
| Light theme removed | ✅ Complete |
| Logo consistent across all pages | ✅ Complete |
| CSS consolidated into styles.css | ✅ Complete |
| Nav/footer links readable | ✅ Complete |
| Footer standardized across pages | ✅ Complete |
| Favicon | ✅ Complete |
| Body copy font weight — 300 → 400 | ✅ Complete |
| Biomarkers link added to nav | ✅ Complete |
| Contact link added to footer | ✅ Complete |

### Technical SEO
| Item | Status |
|---|---|
| OG tags + Twitter Card in base.njk | ✅ Complete |
| Canonical link in base.njk | ✅ Complete |
| Robots meta in base.njk | ✅ Complete |
| Organization + WebSite schema (JSON-LD) in base.njk | ✅ Complete |
| robots.txt — all crawlers + AI agents explicitly permitted | ✅ Complete |
| llms.txt — AI agent site description | ✅ Complete |
| OG image — 1200×630 (og-image.png) | ✅ Complete |
| Biomarker page template — full schema stack (Article, MedicalWebPage, FAQPage, BreadcrumbList) | ✅ Complete |
| Google Search Console — domain verified | ❌ Not done |
| Sitemap — generated + submitted to GSC | ✅ Complete — sitemap.njk live; GSC submission pending |

### Analytics & Tracking
| Item | Status |
|---|---|
| GA4 | ✅ Complete — G-28CHRFJLKJ |
| Microsoft Clarity | ✅ Complete — wa32lp8ja6 |

---

## Immediate Next Steps (Resume Here)

### Phase 1 — Technical Foundation ✅ Complete
### Phase 2 — Site Structure ✅ Complete

### Phase 3 — Write All Content (noindexed) ✅ Complete
> **Strategy:** All 18 first-wave biomarker pages are written and pushed live — but noindexed — before the medical reviewer is brought on. The reviewer evaluates content on the live site. On sign-off, pages flip to indexed and content is announced publicly.

15. **Google Search Console** — verify domain via DNS TXT record; submit sitemap.xml **(you, admin task)**
16. ~~**Write biomarkers/apob.njk**~~ ✅ Done — April 16 2026
17. ~~**Write biomarkers/hba1c.njk**~~ ✅ Done — April 17 2026
18. ~~**Write biomarkers/hscrp.njk**~~ ✅ Done — April 17 2026
19. ~~**Write biomarkers/vitamin-d.njk**~~ ✅ Done — April 18 2026
20. ~~**Write biomarkers/testosterone.njk**~~ ✅ Done — April 18 2026
21. ~~**Write biomarkers/homocysteine.njk**~~ ✅ Done — April 19 2026
22. ~~**Write remaining 12 biomarker pages**~~ ✅ Done — April 19 2026
23. ~~**Noindex flag**~~ ✅ All 18 pages confirmed noindexed
24. ~~**Update index.njk**~~ ✅ All 18 cards active — April 19 2026

### Phase 4 — Medical Review
24. **Recruit medical reviewer** — MD, RD, or PhD with longevity/clinical background; part-time; review all 18 pages
25. **Reviewer reviews live noindexed pages** — reviewer accesses via direct URL on agelesslabs.ai
26. **Incorporate feedback** — update content, ranges, citations as needed
27. **Add reviewer byline** — name + credentials added to each page's reviewer block

### Phase 5 — Public Launch
28. **Flip noindex → index** — remove `noindex: true` from all biomarker page frontmatter
29. **Blog nav link** — add Blog to `base.njk` nav
30. **Resubmit sitemap** to Google Search Console
31. **Announce** — social, email, community posts

### Phase 6 — Monetization
32. **Email capture** — free "Longevity Lab Guide" lead magnet
33. **Paid tier ($19 report)** — Stripe integration

---

## Known Issues / Tech Debt

- **Drive old flat files** — root of Source Files folder still contains old flat copies of biomarker files (pre-subfolder era). These are stale and can be deleted manually. They do not affect the live site. GitHub is clean.
- **Drive MCP large file uploads** — files >~3KB fail or upload truncated via the Drive MCP API. Workaround: use GitHub as source of truth; Drive is for staging new files written during a session only.

---

## Key Learnings & Principles

- **YAML frontmatter duplicate keys cause silent build failures** — specifically duplicate `permalink` keys; always audit frontmatter when builds fail unexpectedly.
- **`base.njk` robots meta should be dynamic**, not static — use a Nunjucks conditional: emit `noindex, follow` when `noindex: true` is in frontmatter, `index, follow` otherwise.
- **Biomarker pages use `layout: biomarker.njk`** with prose-only body content — the layout handles all structural/schema elements. Don't duplicate schema in individual page files.
- **Stray files in content directories** (e.g., `tmp` files, legacy `biomarkers-index.njk`) can interfere with builds — audit directory contents when unexpected behavior occurs.
- **Arrow characters** in index cards must use `&#8594;` HTML entity — the Unicode `→` character (U+2192) mojibakes to `â` when passed through the GitHub editor CM6 contenteditable interface.
- **Biomarker files belong in `src/biomarkers/`** — files placed in `src/` directly will build to the correct URL via frontmatter permalink, but won't be included in the 11ty `biomarkers` collection.
- **AgelessLabs master plan timestamps must include time, not just date.**

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
- **Color palette:** `#111210` bg · `#b5c9a0` green · `#eef2ea` near-white · `#c8a96e` gold
- **Theme:** Dark only (no light theme)
- **Domain:** AgelessLabs.ai — .ai signals AI-powered tool, resonates with tech-forward longevity audience

---

## How to Resume Development with Claude

1. Open a conversation inside the AgelessLabs Claude Project
2. Say: *"Where are we?"* — Claude will read the project files and pick up from the current status above.

**Keep this file current.** When something gets built or decided, update the status table and next steps here. This is the source of truth across all chats.

---

## Content Strategy

### Serving Three Masters

Every piece of content must satisfy all three simultaneously:

1. **Please search engines & AI agents** — structured, semantically rich content that earns organic rankings and gets cited by AI models.
2. **Be genuinely useful to humans** — real depth, honest analysis, and information people actually want to share and cite.
3. **Drive revenue** — tool CTAs, affiliate links, and paid report upsells woven in naturally.

### Content Architecture

#### Tier 1 — Biomarker Reference Library
*One page per biomarker. The backbone of organic and AI traffic. Target: 60–80 pages.*

**Priority first wave (18 markers):**
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

### Publishing Cadence

| Phase | Timeline | Focus |
|---|---|---|
| Foundation | Weeks 1–4 | 10 priority biomarker pages, "How to Read a Blood Test", best lab tests roundup |
| Authority building | Weeks 5–8 | Next 10 biomarkers, 3 protocol guides, 2 comparison pages, 2 influencer pages |
| Coverage & depth | Weeks 9–16 | Complete first-wave library, demographic guides, symptom bridge content |
| Scale | Month 4+ | Programmatic SEO, complete 60–80 page library, content refresh cycle |

---

*AgelessLabs.ai — Master Project Plan · April 2026*
