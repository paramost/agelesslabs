// api/affiliate-click.js
// Logs affiliate link clicks to the 'Affiliate Clicks' tab of the feedback Google Sheet,
// then 302-redirects to the destination. Auto-creates the tab on first write.
// Skips logging when referrer is empty (bots/crawlers) or contains /ops/ (dashboard test clicks).
// Env vars required: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_KEY

var ALLOWED_HOSTS = [
  'ultalabtests.com',
  'superpower.com',
  'insidetracker.com',
  'marekhealth.com'
];

var TAB_NAME = 'Affiliate Clicks';

export default async function handler(req, res) {
  var partner = (req.query && req.query.partner) ? String(req.query.partner).slice(0, 100) : 'unknown';
  var destination = (req.query && req.query.destination) ? String(req.query.destination) : '';

  var destUrl = null;
  try {
    destUrl = new URL(destination);
  } catch (e) {
    return res.status(400).send('Invalid destination');
  }

  var host = destUrl.hostname.toLowerCase();
  var allowed = ALLOWED_HOSTS.some(function (d) {
    return host === d || host.endsWith('.' + d);
  });

  if (!allowed || destUrl.protocol !== 'https:') {
    return res.status(400).send('Destination not allowed');
  }

  var referer = req.headers.referer || req.headers.referrer || '';

  // Skip logging: empty referrer (bots/crawlers) or clicks from the ops dashboard
  var shouldLog = referer !== '' && referer.indexOf('/ops/') === -1;

  if (shouldLog) {
    try {
      await logClick(partner, referer, destination);
    } catch (err) {
      console.error('affiliate-click logging error:', err);
      // Never block the redirect on a logging failure
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', destination);
  return res.end();
}

async function logClick(partner, referer, destination) {
  var serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  var sheetId = process.env.GOOGLE_SHEET_ID;
  var token = await getAccessToken(serviceAccountKey);

  var sourcePage = '';
  try {
    sourcePage = new URL(referer).pathname;
  } catch (e) {
    sourcePage = referer;
  }

  var row = [new Date().toISOString(), partner, sourcePage, referer, destination];

  var result = await appendRows(sheetId, token, [row]);
  if (!result.success && result.missingTab) {
    // Tab does not exist yet - create it, then write header + data row
    await createTab(sheetId, token);
    await appendRows(sheetId, token, [
      ['Timestamp', 'Partner', 'Source Page', 'Referrer', 'Destination'],
      row
    ]);
  }
}

async function appendRows(sheetId, token, values) {
  var range = encodeURIComponent("'" + TAB_NAME + "'!A:E");
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId +
    '/values/' + range + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS';

  var response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: values })
  });

  if (response.ok) {
    return { success: true };
  }

  var errText = await response.text();
  if (errText.indexOf('Unable to parse range') !== -1) {
    return { success: false, missingTab: true };
  }
  throw new Error('Sheets append failed: ' + errText);
}

async function createTab(sheetId, token) {
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + ':batchUpdate';

  var response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [{ addSheet: { properties: { title: TAB_NAME } } }]
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    // Ignore race condition where the tab was just created
    if (errText.indexOf('already exists') === -1) {
      throw new Error('Sheets addSheet failed: ' + errText);
    }
  }
}

// -- JWT / OAuth2 helpers (same pattern as api/feedback.js)

async function getAccessToken(serviceAccount) {
  var now = Math.floor(Date.now() / 1000);

  var header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  var payload = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }));

  var signingInput = header + '.' + payload;
  var signature = await signRS256(signingInput, serviceAccount.private_key);
  var jwt = signingInput + '.' + signature;

  var tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  var tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    throw new Error('Token exchange failed: ' + JSON.stringify(tokenData));
  }

  return tokenData.access_token;
}

function base64url(str) {
  var b64 = Buffer.from(str).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signRS256(data, pemKey) {
  var keyData = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  var binaryKey = Buffer.from(keyData, 'base64');

  var cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  var signature = await crypto.subtle.sign(
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
