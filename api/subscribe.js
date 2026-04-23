export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const response = await fetch('https://api.convertkit.com/v3/forms/9359651/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        api_key: process.env.KIT_API_KEY,
        email:   email.trim()
      })
    });

    const data = await response.json();

    if (response.ok && data.subscription) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Kit API error:', data);
      return res.status(400).json({ error: 'Subscription failed' });
    }
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
