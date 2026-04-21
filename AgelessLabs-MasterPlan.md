# AgelessLabs.ai — Master Project Plan

> Single source of truth. Replaces all prior planning notes.
> Last updated: April 21, 2026 · 4:30 PM CST

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
| Payments | Stripe | Not yet integrated |
| Hosting | Vercel | Auto-deploys from GitHub on push to main |
| Template language | Nunjucks (.njk) | Single base layout, pages extend it |

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

GitHub is the source of truth. Claude fetches files via raw URLs:
`https://raw.githubusercontent.com/paramost/agelesslabs/main/src/[path/to/file]`

**GitHub fetch gotcha:** Navigate to `https://github.com/paramost/agelesslabs` first to establish domain context — cold raw URL fetches fail.

**GitHub editing via browser:** Claude can edit files directly in the GitHub web editor using CodeMirror 6 automation. Access via `document.querySelector('.cm-content').cmTile.view`. Use `view.dispatch({ changes: { from, to, insert } })` to make programmatic edits.

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
| Google Search Console | Not verified — next admin task |
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
| AI tool — free tier | Complete |
| Model string | claude-sonnet-4-6 |
| PDF upload + extraction | Complete |
| Image upload | Complete |
| Paid tier ($19 report) | Not started |
| Stripe integration | Not started |
| Email capture | Not started |

### Design / CSS
| Item | Status |
|---|---|
| Dark theme (persistent, no toggle) | Complete |
| Light theme removed | Complete |
| Logo consistent across all pages | Complete |
| CSS consolidated into styles.css | Complete |
| Nav/footer links readable | Complete |
| Footer standardized across pages | Complete |
| Favicon | Complete |
| Body copy font weight 300 to 400 | Complete |
| Biomarkers link added to nav | Complete |
| Contact link added to footer | Complete |

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
| Google Search Console — domain verified | Not done — next admin task |
| Sitemap submitted to GSC | Pending GSC verification |

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

Full audit completed. All 18 biomarker pages and 7 supporting pages pass clean: no visible entities, no broken URLs, valid JSON-LD schema on all pages, all `index, follow`.

**Remaining admin task (you, not Claude):**

1. **Google Search Console** — verify domain via DNS TXT record at your registrar, then submit `https://agelesslabs.ai/sitemap.xml` in GSC > Sitemaps

### Phase 5 — Monetization — YOU ARE HERE

2. **Drive early traffic** — post AI tool to r/longevity, r/PeterAttia, r/biohacking; Twitter/X longevity community; share a real biomarker interpretation as a demo post
3. **Email capture** — free "Longevity Lab Guide" lead magnet
4. **Paid tier ($19 report)** — Stripe integration

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

- **Drive old flat files** — root of Source Files folder contains stale old flat copies of biomarker files. Can be deleted manually. GitHub is clean.
- **Drive MCP large file uploads** — files >~3KB may fail or upload truncated. Workaround: produce master plan as a downloadable file and upload to Drive manually.
- **Drive hba1c.njk and apob.njk** — stale stub files (652 bytes and 2,344 bytes) in Drive src/biomarkers/. Do not use. GitHub versions are correct.
- **HTML entities in JSON-LD title strings** — pages whose `title` frontmatter contains `&#8212;` will have that literal string in their JSON-LD structured data. Not a validity issue (valid JSON string), but ideally those titles would use plain Unicode `—`. Low priority — does not affect rendered output or schema parsing.

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
- **Medical review is a Year 1 scale play, not a launch requirement** — index pages and drive traffic first; recruit reviewer once site is generating consistent revenue.

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
- **Theme:** Dark only (no light theme)
- **Domain:** AgelessLabs.ai — .ai signals AI-powered tool, resonates with tech-forward longevity audience

---

## How to Resume Development with Claude

1. Open a conversation inside the AgelessLabs Claude Project
2. Say: "Where are we?" — Claude will read the project files and resume from current status above.

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
One page per biomarker. The backbone of organic and AI traffic. Target: 60-80 pages.

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

*AgelessLabs.ai — Master Project Plan · April 2026*
