// api/gsc-setup.js
// One-time OAuth2 setup endpoint for GSC + GA4 access.
// Protected by DIGEST_KEY.
// Visit /api/gsc-setup?key=YOUR_KEY to start the OAuth flow.
// After authorization, the refresh token is displayed on screen.
// Copy it and save as GOOGLE_REFRESH_TOKEN in Vercel env vars.

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
].join(' ');

const REDIRECT_URI = 'https://agelesslabs.ai/api/gsc-setup';

export default async function handler(req, res) {
  const key = req.query.key;
  const code = req.query.code;
  const state = req.query.state;

  // Step 1: Initiate OAuth flow
  if (!code) {
    if (!key || key !== process.env.DIGEST_KEY) {
      return res.status(401).send('Unauthorized');
    }

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      state: key,
    });

    return res.redirect(302, 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString());
  }

  // Step 2: Handle callback from Google
  if (state !== process.env.DIGEST_KEY) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.refresh_token) {
      return res.status(400).send('<pre>No refresh token returned.\n\n' + JSON.stringify(tokenData, null, 2) + '</pre>');
    }

    const html = '<!DOCTYPE html><html><head><title>GSC/GA4 Setup Complete</title>'
      + '<style>body{font-family:monospace;background:#111210;color:#b5c9a0;padding:40px}'
      + 'h1{color:#eef2ea;font-size:1.2rem}'
      + '.token{background:#1e201c;border:1px solid #2e3028;padding:16px;border-radius:8px;word-break:break-all;margin:16px 0;color:#c8a96e}'
      + 'p,ol{color:#a0a89a;line-height:1.8}</style></head><body>'
      + '<h1>Setup Complete</h1>'
      + '<p>Your refresh token:</p>'
      + '<div class="token">' + tokenData.refresh_token + '</div>'
      + '<ol>'
      + '<li>Copy the token above</li>'
      + '<li>Go to Vercel &rarr; Settings &rarr; Environment Variables</li>'
      + '<li>Set <strong>GOOGLE_REFRESH_TOKEN</strong> to this value</li>'
      + '<li>Return to <a href="/ops/" style="color:#b5c9a0">/ops/</a> and click Refresh in the Analytics section</li>'
      + '</ol></body></html>';

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Error: ' + err.message);
  }
}
