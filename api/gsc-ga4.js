// api/gsc-ga4.js
// Returns GSC + GA4 analytics data for the ops dashboard.
// Protected by DIGEST_KEY. Uses OAuth2 refresh token flow.
// Env vars: DIGEST_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = req.query.key;
  if (!key || key !== process.env.DIGEST_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const accessToken = await getAccessToken();
    const [gscData, ga4Data] = await Promise.all([
      fetchGSC(accessToken),
      fetchGA4(accessToken),
    ]);

    return res.status(200).json({ gsc: gscData, ga4: ga4Data });
  } catch (err) {
    console.error('gsc-ga4 error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

// -- OAuth2 refresh token exchange
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

// -- Google Search Console
async function fetchGSC(accessToken) {
  const endDate = formatDate(new Date());
  const startDate = formatDate(daysAgo(28));

  const res = await fetch(
    'https://searchconsole.googleapis.com/webmasters/v3/sites/' +
      encodeURIComponent('https://agelesslabs.ai/') +
      '/searchAnalytics/query',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error('GSC API error: ' + err);
  }

  const data = await res.json();
  return (data.rows || []).map(row => ({
    page: row.keys[0].replace('https://agelesslabs.ai', ''),
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(1) + '%',
    position: row.position.toFixed(1),
  }));
}

// -- Google Analytics 4
async function fetchGA4(accessToken) {
  const endDate = formatDate(new Date());
  const startDate = formatDate(daysAgo(28));

  const res = await fetch(
    'https://analyticsdata.googleapis.com/v1beta/properties/532502940:runReport',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error('GA4 API error: ' + err);
  }

  const data = await res.json();
  return (data.rows || []).map(row => ({
    page: row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0].value, 10),
    pageviews: parseInt(row.metricValues[1].value, 10),
  }));
}

// -- Helpers
function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
