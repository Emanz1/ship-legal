# ShipLegal

**Generate privacy policies, terms of service, and cookie policies for your SaaS in 5 minutes.**

[**Try it now** &rarr; ship-legal.vercel.app](https://ship-legal.vercel.app)

---

## Why ShipLegal?

Every SaaS needs legal pages. The existing options are either expensive ($180+/year for Termly) or generate outdated templates that don't cover modern requirements like AI/LLM disclosures or API terms.

ShipLegal fixes this:

- **Free forever** -- generate all 3 documents at no cost
- **AI & LLM ready** -- covers OpenAI, Anthropic, Google AI, Mistral, and more
- **API Terms** -- rate limits, authentication, access levels
- **GDPR & CCPA** -- jurisdiction-aware sections that auto-include based on your user locations
- **100% client-side** -- your data never leaves your browser. Zero tracking. Zero analytics. Zero cookies.
- **Export anywhere** -- copy as Markdown, HTML, or download a zip bundle

## What You Get

| Document | Sections |
|----------|----------|
| **Privacy Policy** | Data collection, third-party services (30+ with auto-linked privacy policies), AI/ML disclosures, GDPR rights, CCPA/CPRA rights, cookie tracking, data retention, international transfers |
| **Terms of Service** | Acceptable use, payment terms, IP, user content, API terms, AI feature disclaimers, dispute resolution (arbitration/mediation/courts), limitation of liability |
| **Cookie Policy** | Cookie types table, third-party cookies, browser management instructions, cookie-free analytics support (Plausible, Fathom) |

## Supported Services

ShipLegal knows about 30+ third-party services and automatically links their privacy policies:

**Payment:** Stripe, Paddle, PayPal, Lemon Squeezy
**Analytics:** Google Analytics, Plausible, Fathom, PostHog, Mixpanel
**Email:** SendGrid, Mailchimp, Resend, Postmark, ConvertKit
**Auth:** Auth0, Clerk, Supabase Auth, Firebase Auth
**Hosting:** Vercel, AWS, Google Cloud, Railway, Fly.io
**Error Tracking:** Sentry, LogRocket, Datadog
**AI:** OpenAI, Anthropic, Google AI, Mistral, Cohere

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS v4
- marked + DOMPurify (XSS-safe Markdown rendering)
- JSZip (client-side zip generation)
- Deployed on Vercel

## Free vs Pro

| Feature | Free | Pro ($29) |
|---------|------|-----------|
| Privacy Policy | Yes | Yes |
| Terms of Service | Yes | Yes |
| Cookie Policy | Yes | Yes |
| GDPR & CCPA sections | Yes | Yes |
| Markdown & HTML export | Yes | Yes |
| AI/LLM disclosure clauses | Yes | Enhanced |
| API Terms of Service | Yes | Enhanced |
| Zip download | -- | Yes |
| ShipLegal branding | Included | Removed |

**Launch promo:** Use code `LAUNCH` at checkout for free Pro access.

## Development

```bash
npm install
npm run dev
```

## License

MIT
