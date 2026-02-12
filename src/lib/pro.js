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

// Configurable checkout URL — replace with your Stripe/Lemon Squeezy/Gumroad link
// After payment, the platform redirects to: https://ship-legal.vercel.app/?pro=true
export const CHECKOUT_URL = '#pricing';
export const PRICE = 29;
