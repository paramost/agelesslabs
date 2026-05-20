export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const apiKey   = process.env.ML_API_KEY;
  const groupId  = '187945335219291618';

  if (!apiKey) {
    return res.status(500).json({ error: 'Email API key not configured.' });
  }

  try {
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': apiKey,
      },
      body: JSON.stringify({
        email: email.trim(),
        groups: [groupId],
        resubscribe: true,
      }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      return res.status(200).json({ success: true });
    } else {
      console.error('MailerLite API error:', data);
      return res.status(400).json({ error: 'Subscription failed' });
    }
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
