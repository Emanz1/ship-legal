import { formatDate, SERVICE_PRIVACY_LINKS, LEGAL_DISCLAIMER } from './helpers.js';

export function generateCookiePolicy(data) {
  const sections = [];
  const date = formatDate(data.effectiveDate);

  // No-cookie declaration
  if (data.cookieUsage === 'No cookies at all') {
    return generateNoCookieDeclaration(data, date);
  }

  // Header
  sections.push(`# Cookie Policy

**Last updated:** ${date}

This Cookie Policy explains how ${data.companyName} ("we," "us," or "our") uses cookies and similar tracking technologies when you visit ${data.productName}${data.websiteUrl ? ` (${data.websiteUrl})` : ''} (the "Service"). It explains what these technologies are, why we use them, and your rights to control our use of them.`);

  // What Are Cookies
  sections.push(`## What Are Cookies

Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or work more efficiently, as well as to provide reporting information.

Cookies set by the website owner (in this case, ${data.companyName}) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website, such as analytics, advertising, and interactive content.`);

  // Types of Cookies We Use
  let cookieTypes = `## Types of Cookies We Use

### Essential Cookies

These cookies are strictly necessary for the Service to function and cannot be switched off in our systems. They are usually set only in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the Service will not work without them.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session_id | Maintains your session state | Session |
| csrf_token | Security — prevents cross-site request forgery | Session |
| cookie_consent | Stores your cookie preferences | 1 year |`;

  if (data.cookieUsage === 'Analytics + Essential' || data.cookieUsage === 'Marketing + Analytics + Essential') {
    cookieTypes += `

### Analytics Cookies

These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Service. They help us understand which pages are the most and least popular and see how visitors move around the Service. All information these cookies collect is aggregated and therefore anonymous.`;

    const analyticsServices = data.analyticsServices?.filter(s => s !== 'None') || [];
    if (analyticsServices.length > 0) {
      cookieTypes += `\n\nWe use the following analytics services:\n`;
      for (const service of analyticsServices) {
        const link = SERVICE_PRIVACY_LINKS[service];
        if (service === 'Plausible' || service === 'Fathom') {
          cookieTypes += `\n- **${service}** — ${service} is a privacy-focused analytics tool that does not use cookies. It collects aggregate data only and does not track individual users.${link ? ` [Privacy Policy](${link})` : ''}`;
        } else {
          cookieTypes += `\n- **${service}**${link ? ` — [Privacy Policy](${link})` : ''}`;
        }
      }
    }
  }

  if (data.cookieUsage === 'Marketing + Analytics + Essential') {
    cookieTypes += `

### Marketing Cookies

These cookies may be set through our Service by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.`;
  }

  sections.push(cookieTypes);

  // Third-Party Cookies
  const thirdPartyServices = [];
  const analyticsServices = data.analyticsServices?.filter(s => s !== 'None') || [];
  const errorServices = data.errorTrackingServices?.filter(s => s !== 'None') || [];

  if (analyticsServices.length > 0) thirdPartyServices.push(...analyticsServices);
  if (errorServices.length > 0) thirdPartyServices.push(...errorServices);

  if (thirdPartyServices.length > 0) {
    let thirdPartyList = thirdPartyServices.map(service => {
      const link = SERVICE_PRIVACY_LINKS[service];
      return `- **${service}**${link ? `: [Privacy Policy](${link})` : ''}`;
    }).join('\n');

    sections.push(`## Third-Party Cookies

In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and to deliver and improve the Service. The following third-party services may place cookies on your device:

${thirdPartyList}

We do not control the cookies set by these third parties. Please refer to their respective privacy policies for more information about their cookie practices.`);
  }

  // Managing Cookies
  sections.push(`## Managing Cookies

Most web browsers allow you to control cookies through their settings. You can typically find these in the "Options," "Settings," or "Preferences" menu of your browser.

Here is how to manage cookies in popular browsers:

- **Chrome:** Settings > Privacy and Security > Cookies and other site data
- **Firefox:** Settings > Privacy & Security > Cookies and Site Data
- **Safari:** Preferences > Privacy > Cookies and website data
- **Edge:** Settings > Cookies and site permissions > Cookies and site data

You can also opt out of interest-based advertising by visiting:

- [Digital Advertising Alliance (DAA)](http://www.aboutads.info/choices/)
- [Network Advertising Initiative (NAI)](http://www.networkadvertising.org/choices/)
- [European Interactive Digital Advertising Alliance (EDAA)](http://www.youronlinechoices.eu/)

Please note that if you choose to block or delete cookies, some features of the Service may not function properly.`);

  // Cookie-less Analytics Note
  const usesCookielessAnalytics = analyticsServices.some(s => s === 'Plausible' || s === 'Fathom');
  if (usesCookielessAnalytics) {
    const cookieless = analyticsServices.filter(s => s === 'Plausible' || s === 'Fathom');
    sections.push(`## Cookie-Free Analytics

We use ${cookieless.join(' and ')} for website analytics. ${cookieless.length === 1 ? 'This service does' : 'These services do'} not use cookies and ${cookieless.length === 1 ? 'does' : 'do'} not collect any personal data. ${cookieless.length === 1 ? 'It is' : 'They are'} fully compliant with GDPR, CCPA, and PECR without requiring a cookie consent banner. ${cookieless.length === 1 ? 'It provides' : 'They provide'} essential website statistics without compromising visitor privacy.`);
  }

  // Changes
  sections.push(`## Changes to This Cookie Policy

We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or for other operational reasons. We encourage you to periodically review this Cookie Policy for the latest information on our use of cookies.

Any changes to this Cookie Policy will become effective when we post the revised Cookie Policy on this page with a new "Last updated" date.`);

  // Contact
  sections.push(`## Contact Us

If you have any questions about our use of cookies or this Cookie Policy, please contact us at:

**${data.companyName}**
Email: ${data.contactEmail}${data.contactAddress ? `\nAddress: ${data.contactAddress.replace(/\n/g, ', ')}` : ''}`);

  sections.push(LEGAL_DISCLAIMER);

  return sections.join('\n\n');
}

function generateNoCookieDeclaration(data, date) {
  const analyticsServices = data.analyticsServices?.filter(s => s !== 'None') || [];
  let analyticsNote = '';

  if (analyticsServices.length > 0) {
    const privacyFriendly = analyticsServices.filter(s => s === 'Plausible' || s === 'Fathom');
    const otherAnalytics = analyticsServices.filter(s => s !== 'Plausible' && s !== 'Fathom');

    if (privacyFriendly.length > 0) {
      analyticsNote = `\n\nFor website analytics, we use ${privacyFriendly.join(' and ')}, which ${privacyFriendly.length === 1 ? 'is a' : 'are'} privacy-focused analytics ${privacyFriendly.length === 1 ? 'tool' : 'tools'} that ${privacyFriendly.length === 1 ? 'does' : 'do'} not use cookies and ${privacyFriendly.length === 1 ? 'does' : 'do'} not collect any personal data. ${privacyFriendly.length === 1 ? 'It' : 'They'} provide us with essential website statistics without compromising your privacy.`;
    }
    if (otherAnalytics.length > 0) {
      analyticsNote += `\n\nWe use ${otherAnalytics.join(', ')} for analytics. ${otherAnalytics.length === 1 ? 'This service is' : 'These services are'} configured to operate without setting cookies on your device.`;
    }
  }

  return `# Cookie-Free Declaration

**Last updated:** ${date}

${data.companyName} operates ${data.productName}${data.websiteUrl ? ` (${data.websiteUrl})` : ''} (the "Service").

## We Do Not Use Cookies

We want you to know that **${data.productName} does not use cookies** or similar tracking technologies. We believe in providing our Service without the need for tracking cookies, and we have designed our platform to operate without them.

This means:

- **No tracking cookies** — We do not use cookies to track your behavior on our website.
- **No third-party advertising cookies** — We do not allow advertising networks to place cookies on your device through our Service.
- **No cookie consent banner needed** — Since we do not use cookies, you will not see a cookie consent pop-up on our Service.${analyticsNote}

## How We Handle Sessions

Instead of cookies, we may use privacy-preserving alternatives for essential functionality:

- Server-side sessions for authentication and security
- Token-based authentication stored in local storage (which you can clear at any time through your browser settings)
- URL parameters for temporary state management

## Questions

If you have any questions about our cookie-free approach, please contact us at:

**${data.companyName}**
Email: ${data.contactEmail}${data.contactAddress ? `\nAddress: ${data.contactAddress.replace(/\n/g, ', ')}` : ''}

${LEGAL_DISCLAIMER}`;
}
