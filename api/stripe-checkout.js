import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey) return res.status(500).json({ error: 'Stripe key not configured.' });
  if (!priceId)   return res.status(500).json({ error: 'Stripe price ID not configured.' });

  const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  const origin = req.headers.origin || 'https://agelesslabs.ai';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/analyze?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/analyze?cancelled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create checkout session', message: err.message });
  }
}
