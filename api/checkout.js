import Stripe from 'stripe';

export default async function handler(req, res) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.redirect(302, '/?error=payment_not_configured');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://ship-legal.vercel.app'}/?pro=true`,
    cancel_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://ship-legal.vercel.app'}/#pricing`,
  });

  res.redirect(303, session.url);
}
