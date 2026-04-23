// api/digest.js
// AgelessLabs Community Digest — Vercel Serverless Function
//
// GET /api/digest?key=YOUR_DIGEST_KEY
// GET /api/digest?key=YOUR_DIGEST_KEY&drafts=false  (skip Claude draft generation)
//
// Required env vars:
//   DIGEST_KEY         — secret string protecting this endpoint
//   ANTHROPIC_API_KEY  — already set from the AI tool

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DIGEST_KEY = process.env.DIGEST_KEY;

// ─── Sources ─────────────────────────────────────────────────────────────────

const REDDIT_SUBREDDITS = [
  { name: 'longevity',   weight: 1.0 },
  { name: 'biohacking',  weight: 0.9 },
  { name: 'PeterAttia',  weight: 0.85 },
];

// Keywords that signal a post is in our wheelhouse
const KEYWORDS = [
  'apob', 'apolipoprotein', 'hscrp', 'hs-crp', 'crp', 'biomarker',
  'blood test', 'bloodwork', 'blood work', 'lab results', 'labs',
  'fasting insulin', 'insulin resistance', 'hba1c', 'a1c',
  'vitamin d', 'homocysteine', 'ferritin', 'tsh', 'thyroid',
  'igf-1', 'igf1', 'triglycerides', 'omega-3', 'omega 3',
  'ldl', 'hdl', 'cholesterol', 'lipoprotein', 'lp(a)',
  'cortisol', 'uric acid', 'creatinine', 'egfr', 'albumin',
  'testosterone', 'longevity panel', 'interpret', 'optimal range',
  'function health', 'ulta lab', 'marek health', 'insidetracker',
];

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scorePost(post) {
  let score = 0;
  const text = `${post.title} ${post.excerpt}`.toLowerCase();

  // Keyword relevance (most important signal)
  for (const kw of KEYWORDS) {
    if (text.includes(kw)) score += 3;
  }
  // Bonus for question-style posts (high reply value)
  if (/\?|how |what |why |should |help/.test(text)) score += 4;

  // Engagement (capped so viral off-topic posts don't swamp)
  score += Math.min((post.upvotes || 0) / 5, 8);
  score += Math.min((post.comments || 0) / 3, 8);

  // Recency bonus
  const ageHours = post.age_hours || 999;
  if (ageHours < 6)       score += 8;
  else if (ageHours < 12) score += 5;
  else if (ageHours < 24) score += 2;
  else if (ageHours < 48) score += 0;
  else                    score -= 3; // deprioritise old threads

  return Math.max(score, 0);
}

// ─── Reddit ───────────────────────────────────────────────────────────────────

// Search terms — broad enough to surface relevant threads
const REDDIT_SEARCH_TERMS = [
  'ApoB OR hsCRP OR biomarker',
  'lab results OR bloodwork OR "blood test"',
  'fasting insulin OR "vitamin D" OR homocysteine',
  'longevity labs OR "longevity panel"',
];

async function fetchReddit(subreddit) {
  const seen = new Set();
  const posts = [];

  for (const q of REDDIT_SEARCH_TERMS) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(q)}&sort=new&t=week&limit=15&restrict_sr=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AgelessLabs-Digest/1.0 (community monitoring tool)' },
      });
      if (!res.ok) continue;
      const data = await res.json();

      for (const { data: p } of (data.data?.children || [])) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        posts.push({
          id:        `reddit_${p.id}`,
          source:    `r/${subreddit}`,
          title:     p.title,
          excerpt:   (p.selftext || '').slice(0, 400),
          url:       `https://reddit.com${p.permalink}`,
          upvotes:   p.ups || 0,
          comments:  p.num_comments || 0,
          age_hours: Math.round((Date.now() / 1000 - p.created_utc) / 3600),
        });
      }
    } catch (e) {
      // silently skip failed search terms
    }
  }
  return posts;
}

async function fetchAllReddit() {
  const results = await Promise.allSettled(
    REDDIT_SUBREDDITS.map(s => fetchReddit(s.name))
  );
  const posts = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      r.value.forEach(p => posts.push({ ...p, weight: REDDIT_SUBREDDITS[i].weight }));
    } else {
      console.warn(`Reddit r/${REDDIT_SUBREDDITS[i].name} failed:`, r.reason?.message);
    }
  });
  return posts;
}

// ─── rapamycin.news (Discourse) ──────────────────────────────────────────────

async function fetchRapamycinNews() {
  const searches = ['biomarker bloodwork ApoB labs', 'longevity blood test'];
  const seen = new Set();
  const posts = [];

  for (const q of searches) {
    try {
      const url = `https://www.rapamycin.news/search.json?q=${encodeURIComponent(q)}&order=latest`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AgelessLabs-Digest/1.0' },
      });
      if (!res.ok) continue;
      const data = await res.json();

      for (const t of (data.topics || [])) {
        if (seen.has(t.id)) continue;
        seen.add(t.id);
        posts.push({
          id:       `rap_${t.id}`,
          source:   'rapamycin.news',
          title:    t.title,
          excerpt:  t.blurb || '',
          url:      `https://www.rapamycin.news/t/${t.slug}/${t.id}`,
          upvotes:  t.like_count || 0,
          comments: Math.max((t.posts_count || 1) - 1, 0),
          age_hours: Math.round((Date.now() - new Date(t.created_at).getTime()) / 3600000),
          weight:   1.0,
        });
      }
    } catch (e) {
      console.warn('rapamycin.news search failed:', e.message);
    }
  }
  return posts;
}

// ─── Claude draft generation ─────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You help AgelessLabs.ai build genuine community presence on longevity forums.

AgelessLabs.ai facts you can draw on:
- Free AI biomarker interpreter at agelesslabs.ai/analyze (upload labs → longevity score + breakdown)
- 18 detailed biomarker reference pages at agelesslabs.ai/biomarkers
- Longevity-optimal ranges are more aggressive than standard lab reference ranges:
  ApoB <60 mg/dL · fasting insulin <6 uIU/mL · hsCRP <0.5 mg/L · HbA1c <5.3% · Vitamin D 50–80 ng/mL
  Homocysteine <7 µmol/L · Ferritin 50–100 ng/mL · TSH 1.0–2.0 mIU/L · IGF-1 120–180 ng/mL
  Triglycerides <80 mg/dL · Omega-3 Index >8% · LDL <70 mg/dL · HDL 50–80 mg/dL
  Cortisol AM 10–18 µg/dL · Uric acid <5.5 mg/dL · eGFR >90 · Albumin 4.5–5.0 g/dL · Lp(a) <30 mg/dL

Voice: authoritative, clinical, not wellness-fluffy. Match the sophistication of the community.`;

async function generateDraft(post) {
  const prompt = `Write a reply to this forum post. Be genuinely helpful and specific.

Source: ${post.source}
Title: ${post.title}
Post excerpt: ${post.excerpt || '(title only)'}
URL: ${post.url}

Rules:
1. Add real value with accurate, specific information — not generic advice
2. Sound like a knowledgeable person, not a brand
3. Only mention AgelessLabs.ai if it directly answers what they're asking (max once, at the end)
4. 2–4 short paragraphs. No bullet lists unless the post asks for a comparison.
5. Do NOT start with "Great question" or any sycophantic opener
6. Match the technical level of the source community (rapamycin.news = expert, r/biohacking = intermediate)

Reply text only — no preamble, no "Here's a draft:" intro.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_CONTEXT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) return `[Draft generation failed: ${res.status}]`;
  const data = await res.json();
  return data.content?.[0]?.text || '[Empty response]';
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS — allows the digest page to call this from the browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth
  const { key, drafts: draftsParam = 'true', limit: limitParam = '8' } = req.query;
  if (!DIGEST_KEY || key !== DIGEST_KEY) {
    return res.status(401).json({ error: 'Invalid or missing key.' });
  }

  const includeDrafts = draftsParam !== 'false';
  const postLimit = Math.min(parseInt(limitParam, 10) || 8, 12);

  try {
    // Fetch from all sources in parallel
    const [redditPosts, rapPosts] = await Promise.all([
      fetchAllReddit(),
      fetchRapamycinNews(),
    ]);

    // Score and sort — no minimum threshold, just rank by relevance
    const allPosts = [...redditPosts, ...rapPosts];
    const scored = allPosts
      .map(p => ({ ...p, score: scorePost(p) * (p.weight || 1) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, postLimit);

    // Generate drafts (if requested)
    const withDrafts = includeDrafts
      ? await Promise.all(scored.map(async p => ({ ...p, draft: await generateDraft(p) })))
      : scored.map(p => ({ ...p, draft: null }));

    return res.status(200).json({
      generated_at: new Date().toISOString(),
      sources_checked: ['r/longevity', 'r/biohacking', 'r/PeterAttia', 'rapamycin.news'],
      total_posts_scanned: allPosts.length,
      reddit_count: redditPosts.length,
      rapamycin_count: rapPosts.length,
      posts: withDrafts.map(p => ({
        id:        p.id,
        source:    p.source,
        title:     p.title,
        excerpt:   p.excerpt,
        url:       p.url,
        upvotes:   p.upvotes,
        comments:  p.comments,
        age_hours: p.age_hours,
        score:     Math.round(p.score * 10) / 10,
        draft:     p.draft,
      })),
    });
  } catch (err) {
    console.error('Digest handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
