const STORAGE_KEY = 'shiplegal_pro';
const UNLOCK_PARAM = 'pro';

// Valid promo codes (uppercase)
const PROMO_CODES = ['LAUNCH', 'SHIPLEGAL', 'PRODUCTHUNT'];

export function checkProStatus() {
  // Check URL params first (payment redirect)
  const params = new URLSearchParams(window.location.search);
  if (params.get(UNLOCK_PARAM) === 'true') {
    localStorage.setItem(STORAGE_KEY, 'true');
    // Clean URL without reload
    const url = new URL(window.location);
    url.searchParams.delete(UNLOCK_PARAM);
    window.history.replaceState({}, '', url.pathname);
    return true;
  }

  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function isPro() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function redeemPromoCode(code) {
  if (PROMO_CODES.includes(code.trim().toUpperCase())) {
    localStorage.setItem(STORAGE_KEY, 'true');
    return true;
  }
  return false;
}

// Stripe checkout via Vercel serverless function
// Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in Vercel env vars to activate
export const CHECKOUT_URL = '/api/checkout';

// Solana wallet for crypto payment
export const SOL_WALLET = 'BtErPc3vB64wg2edmXf5byTRCjHBf3ezNFaYsCyEeJZT';

export const PRICE = 29;
