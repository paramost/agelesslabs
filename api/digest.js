// api/digest.js
// AgelessLabs Community Digest — Vercel Edge Function
//
// Running as Edge (Cloudflare network) so Reddit doesn't block the IP.
// Reddit fetched via RSS/Atom — no credentials or app registration needed.
//
// GET /api/digest?key=YOUR_DIGEST_KEY
// GET /api/digest?key=YOUR_DIGEST_KEY&drafts=false   (skip draft generation)
// GET /api/digest?key=YOUR_DIGEST_KEY&limit=10       (default 8, max 12)
//
// Required env vars:
//   DIGEST_KEY        — secret string protecting this endpoint
//   ANTHROPIC_API_KEY — already set from the AI tool

export const config = { runtime: 'edge' };

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DIGEST_KEY        = process.env.DIGEST_KEY;

// ─── Sources ─────────────────────────────────────────────────────────────────

const REDDIT_SUBREDDITS = [
  { name: 'longevity',  weight: 1.0 },
  { name: 'biohacking', weight: 0.9 },
  { name: 'PeterAttia', weight: 0.85 },
];

// Four targeted searches — every result should be topically relevant
const REDDIT_SEARCH_TERMS = [
  'ApoB OR hsCRP OR biomarker',
  'lab results OR bloodwork longevity',
  'fasting insulin OR homocysteine OR "vitamin D"',
  'longevity labs OR "longevity panel" OR "blood test"',
];

// Keywords used for relevance scoring
const KEYWORDS = [
  'apob', 'apolipoprotein', 'hscrp', 'hs-crp', 'biomarker',
  'blood test', 'bloodwork', 'blood work', 'lab results', 'labs',
  'fasting insulin', 'insulin resistance', 'hba1c', 'a1c',
  'vitamin d', 'homocysteine', 'ferritin', 'tsh', 'thyroid',
  'igf-1', 'igf1', 'triglycerides', 'omega-3', 'omega 3',
  'ldl', 'hdl', 'cholesterol', 'lipoprotein', 'lp(a)',
  'cortisol', 'uric acid', 'creatinine', 'egfr', 'albumin',
  'testosterone', 'longevity panel', 'optimal range',
  'function health', 'ulta lab', 'marek health', 'insidetracker',
];

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scorePost(post) {
  let score = 0;
  const text = `${post.title} ${post.excerpt}`.toLowerCase();

  for (const kw of KEYWORDS) {
    if (text.includes(kw)) score += 3;
  }
  if (/\?|how |what |why |should |help/.test(text)) score += 4;

  score += Math.min((post.upvotes  || 0) / 5, 8);
  score += Math.min((post.comments || 0) / 3, 8);

  const h = post.age_hours || 999;
  if      (h < 6)  score += 8;
  else if (h < 12) score += 5;
  else if (h < 24) score += 2;
  else if (h > 48) score -= 3;

  return Math.max(score, 0);
}

// ─── Reddit via RSS/Atom ──────────────────────────────────────────────────────
// No credentials needed. Edge runtime IPs (Cloudflare) are not blocked by Reddit.

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&#x27;/g, "'");
}

function parseAtomEntries(xml) {
  const entries = [];
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

  for (const entry of entryMatches) {
    const get = (tag) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? decodeXmlEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim()) : '';
    };
    const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/);
    const link = linkMatch ? linkMatch[1] : '';
    const idRaw = get('id');
    const id = idRaw.split('_').pop() || idRaw;

    const updatedStr = get('updated') || get('published');
    const ageHours = updatedStr
      ? Math.round((Date.now() - new Date(updatedStr).getTime()) / 3600000)
      : 999;

    const content = get('content');
    const upvoteMatch = content.match(/(\d+)\s+points?/i);
    const upvotes = upvoteMatch ? parseInt(upvoteMatch[1], 10) : 0;
    const excerpt = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);

    entries.push({ id, title: get('title'), link, excerpt, upvotes, ageHours });
  }
  return entries;
}

async function fetchRedditSubreddit(subreddit) {
  const seen  = new Set();
  const posts = [];

  for (const q of REDDIT_SEARCH_TERMS) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodeURIComponent(q)}&sort=new&t=week&limit=15&restrict_sr=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'AgelessLabs-Digest/1.0',
          'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*',
        },
      });
      if (!res.ok) continue;

      const xml = await res.text();
      const entries = parseAtomEntries(xml);

      for (const e of entries) {
        if (!e.id || seen.has(e.id)) continue;
        seen.add(e.id);
        posts.push({
          id:        `reddit_${e.id}`,
          source:    `r/${subreddit}`,
          title:     e.title,
          excerpt:   e.excerpt,
          url:       e.link,
          upvotes:   e.upvotes,
          comments:  0,
          age_hours: e.ageHours,
        });
      }
    } catch (e) {
      // individual search term failure — silently continue
    }
  }
  return posts;
}

async function fetchAllReddit() {
  const results = await Promise.allSettled(
    REDDIT_SUBREDDITS.map(s => fetchRedditSubreddit(s.name))
  );
  const posts = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      r.value.forEach(p => posts.push({ ...p, weight: REDDIT_SUBREDDITS[i].weight }));
    }
  });
  return posts;
}

// ─── rapamycin.news (Discourse) ──────────────────────────────────────────────

async function fetchRapamycinNews() {
  const searches = ['biomarker bloodwork ApoB labs', 'longevity blood test'];
  const seen  = new Set();
  const posts = [];

  for (const q of searches) {
    try {
      const url = `https://www.rapamycin.news/search.json?q=${encodeURIComponent(q)}&order=latest`;
      const res = await fetch(url, { headers: { 'User-Agent': 'AgelessLabs-Digest/1.0' } });
      if (!res.ok) continue;
      const data = await res.json();

      for (const t of (data.topics || [])) {
        if (seen.has(t.id)) continue;
        seen.add(t.id);
        posts.push({
          id:        `rap_${t.id}`,
          source:    'rapamycin.news',
          title:     t.title,
          excerpt:   t.blurb || '',
          url:       `https://www.rapamycin.news/t/${t.slug}/${t.id}`,
          upvotes:   t.like_count || 0,
          comments:  Math.max((t.posts_count || 1) - 1, 0),
          age_hours: Math.round((Date.now() - new Date(t.created_at).getTime()) / 3600000),
          weight:    1.0,
        });
      }
    } catch (e) {
      // continue
    }
  }
  return posts;
}

// ─── Claude draft generation ─────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You help AgelessLabs.ai build genuine community presence on longevity forums.

AgelessLabs.ai facts you can draw on:
- Free AI biomarker interpreter at agelesslabs.ai/analyze (upload labs → longevity score + per-marker breakdown)
- 18 detailed biomarker reference pages at agelesslabs.ai/biomarkers
- Longevity-optimal ranges (more aggressive than standard lab reference ranges):
  ApoB <60 mg/dL · Fasting insulin <6 uIU/mL · hsCRP <0.5 mg/L · HbA1c <5.3% · Vitamin D 50–80 ng/mL
  Homocysteine <7 µmol/L · Ferritin 50–100 ng/mL · TSH 1.0–2.0 mIU/L · IGF-1 120–180 ng/mL
  Triglycerides <80 mg/dL · Omega-3 Index >8% · LDL <70 mg/dL · HDL 50–80 mg/dL
  Cortisol AM 10–18 µg/dL · Uric acid <5.5 mg/dL · eGFR >90 · Albumin 4.5–5.0 g/dL · Lp(a) <30 mg/dL

Voice: authoritative, clinical, not wellness-fluffy. Match the sophistication of the source community.`;

async function generateDraft(post) {
  const prompt = `Write a reply to this forum post. Be genuinely helpful and specific.

Source: ${post.source}
Title: ${post.title}
Post excerpt: ${post.excerpt || '(title only — reply based on the title)'}
URL: ${post.url}

Rules:
1. Add real value — specific, accurate information, not generic advice
2. Sound like a knowledgeable person, not a brand or AI
3. Only mention AgelessLabs.ai if it directly solves what they're asking (max once, at the end)
4. 2–4 short paragraphs. Avoid bullet lists unless they asked for a comparison.
5. Do NOT open with "Great question", "That's a great point", or any sycophantic phrase
6. r/PeterAttia and rapamycin.news = expert level; r/biohacking and r/longevity = intermediate

Reply text only — no preamble.`;

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

// ─── Edge handler ─────────────────────────────────────────────────────────────

export default async function handler(req) {
  const url    = new URL(req.url);
  const key    = url.searchParams.get('key')    || '';
  const drafts = url.searchParams.get('drafts') !== 'false';
  const limit  = Math.min(parseInt(url.searchParams.get('limit') || '8', 10), 12);

  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!DIGEST_KEY || key !== DIGEST_KEY) {
    return new Response(JSON.stringify({ error: 'Invalid or missing key.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  try {
    const [redditPosts, rapPosts] = await Promise.all([
      fetchAllReddit(),
      fetchRapamycinNews(),
    ]);

    const allPosts = [...redditPosts, ...rapPosts];
    const scored   = allPosts
      .map(p => ({ ...p, score: scorePost(p) * (p.weight || 1) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const withDrafts = drafts
      ? await Promise.all(scored.map(async p => ({ ...p, draft: await generateDraft(p) })))
      : scored.map(p => ({ ...p, draft: null }));

    const payload = {
      generated_at:    new Date().toISOString(),
      reddit_count:    redditPosts.length,
      rapamycin_count: rapPosts.length,
      total_scanned:   allPosts.length,
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
    };

    return new Response(JSON.stringify(payload), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders,
    });
  }
}
