// api/feedback.js
// Appends page feedback to a Google Sheet via service account JWT auth.
// Env vars required: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_KEY (full JSON string)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { feedback, pageUrl } = req.body || {};

  if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
    return res.status(400).json({ error: 'feedback is required' });
  }

  try {
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const token = await getAccessToken(serviceAccountKey);

    const timestamp = new Date().toISOString();
    const url = pageUrl || '';
    const text = feedback.trim().slice(0, 2000); // cap at 2000 chars

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:C:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[timestamp, url, text]],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Sheets API error:', err);
      return res.status(500).json({ error: 'Failed to write to sheet' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('feedback handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// -- JWT / OAuth2 helpers

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const signature = await signRS256(signingInput, serviceAccount.private_key);
  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

function base64url(str) {
  const b64 = Buffer.from(str).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signRS256(data, pemKey) {
  const keyData = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const binaryKey = Buffer.from(keyData, 'base64');

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(data)
  );

  return Buffer.from(signature)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
