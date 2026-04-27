import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Missing session ID' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Stripe key not configured.' });

  const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    return res.status(200).json({
      success: true,
      email: session.customer_details?.email || null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify session', message: err.message });
  }
}
