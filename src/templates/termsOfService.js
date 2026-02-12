import { formatDate, getJurisdictionText, getDisclaimer } from './helpers.js';

export function generateTermsOfService(data, isPro = false) {
  const sections = [];
  const date = formatDate(data.effectiveDate);

  const productTypeLabel = {
    'SaaS': 'software-as-a-service (SaaS) platform',
    'Mobile App': 'mobile application',
    'API Service': 'API service',
    'Marketplace': 'online marketplace',
    'Other': 'online service',
  };
  const typeLabel = productTypeLabel[data.productType] || 'online service';

  // Header
  sections.push(`# Terms of Service

**Last updated:** ${date}

Please read these Terms of Service ("Terms") carefully before using ${data.productName}${data.websiteUrl ? ` (${data.websiteUrl})` : ''} (the "Service") operated by ${data.companyName} ("we," "us," or "our").

By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.`);

  // Description of Service
  sections.push(`## Description of Service

${data.productName} is a ${typeLabel} that provides users with access to our platform and its features. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.`);

  // User Accounts
  sections.push(`## User Accounts

When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of these Terms, which may result in immediate termination of your account.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

You may not use as a username the name of another person or entity, or a name that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity without appropriate authorization, or a name that is otherwise offensive, vulgar, or obscene.`);

  // Acceptable Use
  sections.push(`## Acceptable Use

You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:

- Use the Service in any way that violates any applicable federal, state, local, or international law or regulation.
- Use the Service to transmit, distribute, or store material that is infringing, obscene, threatening, defamatory, or otherwise unlawful or tortious, including material that violates third-party privacy rights.
- Use the Service to send unsolicited commercial messages ("spam") or any form of unauthorized advertising.
- Attempt to interfere with, compromise the system integrity or security of, or decipher any transmissions to or from the servers running the Service.
- Attempt to gain unauthorized access to any portion of the Service, other accounts, computer systems, or networks connected to the Service, whether through hacking, password mining, or any other means.
- Use any robot, spider, scraper, or other automated means to access the Service for any purpose without our express written permission.
- Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.
- Impersonate or attempt to impersonate ${data.companyName}, a ${data.companyName} employee, another user, or any other person or entity.
- Use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party's use of the Service.

We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.`);

  // Payment Terms
  const collectsPayment = data.dataCollected?.includes('Payment information (credit cards via processor)');
  if (collectsPayment) {
    const paymentProcessors = data.paymentServices?.filter(s => s !== 'None') || [];
    const processorText = paymentProcessors.length > 0
      ? `Payment processing is handled by ${paymentProcessors.join(', ')}. Your payment information is transmitted directly to and stored by our payment processor(s) and is subject to their respective privacy policies and terms of service.`
      : 'Payment processing is handled by our third-party payment processor.';

    sections.push(`## Payment Terms

Certain features of the Service may require payment of fees. You agree to pay all applicable fees as described on the Service in connection with such features.

${processorText}

**Billing.** You authorize us to charge your chosen payment method for all fees owing in connection with the Service. If your payment method fails or your account is past due, we may collect fees using other collection mechanisms. We may also suspend or terminate your access to the Service until payment is received.

**Refunds.** Unless otherwise stated or required by applicable law, all fees are non-refundable. If you believe you have been incorrectly charged, please contact us at ${data.contactEmail} within 30 days of the charge, and we will review your claim.

**Price changes.** We reserve the right to change our prices at any time. If we change our prices, we will provide notice of the change on the Service or by email at least 30 days before the change takes effect. Your continued use of the Service after the price change takes effect constitutes your agreement to pay the updated amount.`);
  }

  // Intellectual Property
  sections.push(`## Intellectual Property

The Service and its original content, features, and functionality are and will remain the exclusive property of ${data.companyName} and its licensors. The Service is protected by copyright, trademark, and other intellectual property laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ${data.companyName}.

You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, visual design elements, or concepts without express written permission from ${data.companyName}.`);

  // User Content
  const collectsUserContent = data.dataCollected?.includes('User-generated content');
  if (collectsUserContent) {
    sections.push(`## User Content

Our Service may allow you to post, link, store, share, and otherwise make available certain information, text, graphics, or other material ("User Content"). You are responsible for the User Content that you post to the Service, including its legality, reliability, and appropriateness.

By posting User Content to the Service, you grant us a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content in connection with operating and providing the Service. This license exists only for the purpose of operating and improving the Service, and does not grant us the right to sell your User Content or otherwise distribute it outside of the Service.

You represent and warrant that: (i) the User Content is yours (you own it) or you have the right to use it and grant us the rights and license set forth in these Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, intellectual property rights, or any other rights of any person.

We reserve the right to remove any User Content from the Service at our sole discretion, for any reason, without notice.`);
  }

  // API Terms
  if (data.hasAPI) {
    let apiDetails = '';
    if (data.hasRateLimits) {
      apiDetails += `\n\n**Rate Limits.** We impose rate limits on API usage to ensure fair access for all users and to maintain the stability and performance of the Service. Exceeding the rate limits may result in temporary throttling or suspension of your API access. Current rate limits are documented in our API documentation.`;
    }
    if (data.requiresAuth) {
      apiDetails += `\n\n**Authentication.** Access to the API requires authentication via API keys or other credentials provided to you. You are responsible for keeping your API keys confidential and must not share them with unauthorized parties. Any activity that occurs using your API keys is your responsibility.`;
    }

    sections.push(`## API Terms

If you access the Service through our Application Programming Interface (API), the following additional terms apply:

**Permitted use.** You may use the API solely for the purpose of integrating with and building applications on top of the Service, in accordance with our API documentation and these Terms.

**Restrictions.** You may not: (i) use the API to build a product or service that competes with the Service; (ii) reverse engineer or attempt to extract the source code from the API; (iii) use the API to collect, store, or process data in violation of applicable privacy laws; (iv) exceed the documented ${data.apiDataAccess === 'Read only' ? 'read' : 'access'} capabilities of the API.${apiDetails}

**API availability.** We do not guarantee that the API will be available at all times or that it will be free from errors or defects. We reserve the right to modify, deprecate, or discontinue the API or any features thereof at any time, with reasonable notice when possible.`);
  }

  // AI Features
  if (data.usesAI) {
    sections.push(`## Artificial Intelligence Features

${data.productName} may include features powered by artificial intelligence and machine learning technology ("AI Features"). The following additional terms apply to your use of AI Features:

**No guarantees of accuracy.** AI Features generate outputs based on statistical models and may produce inaccurate, incomplete, or biased results. You should independently verify any information or content generated by AI Features before relying on it for any purpose. We do not guarantee the accuracy, reliability, completeness, or timeliness of any AI-generated output.

**Your responsibility.** You are solely responsible for how you use AI-generated outputs. We are not liable for any decisions you make or actions you take based on AI-generated content.

**Input data.** When you use AI Features, your inputs may be processed by third-party AI providers. Please review our Privacy Policy for details on how your data is handled in connection with AI Features.

**Intellectual property.** As between you and ${data.companyName}, you retain ownership of your inputs. The intellectual property rights in AI-generated outputs are subject to applicable law and may vary by jurisdiction. We do not claim ownership of outputs generated specifically for you through your use of AI Features.

**Prohibited uses.** You may not use AI Features to: (i) generate content that is illegal, harmful, or violates these Terms; (ii) attempt to extract, replicate, or reverse-engineer the underlying AI models; (iii) generate content that impersonates real individuals; or (iv) use AI-generated outputs in a manner that is misleading or deceptive.`);
  }

  // Termination
  sections.push(`## Termination

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.

Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us at ${data.contactEmail}.

All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`);

  // Limitation of Liability
  sections.push(`## Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ${data.companyName.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:

- YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;
- ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;
- ANY CONTENT OBTAINED FROM THE SERVICE; OR
- UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,

WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.

IN NO EVENT SHALL OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE EXCEED THE GREATER OF ONE HUNDRED DOLLARS ($100) OR THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.`);

  // Disclaimer of Warranties
  sections.push(`## Disclaimer of Warranties

THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.

${data.companyName.toUpperCase()} DOES NOT WARRANT THAT: (A) THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION; (B) ANY ERRORS OR DEFECTS WILL BE CORRECTED; (C) THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR (D) THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS.

YOUR USE OF THE SERVICE IS SOLELY AT YOUR OWN RISK.`);

  // Dispute Resolution
  if (data.disputeResolution === 'Arbitration') {
    sections.push(`## Dispute Resolution

**Binding arbitration.** Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association (or an equivalent arbitration body in your jurisdiction). The arbitration shall be conducted by a single arbitrator, and the decision of the arbitrator shall be final and binding on both parties.

**Class action waiver.** YOU AND ${data.companyName.toUpperCase()} AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.

**Exception.** Notwithstanding the above, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.`);
  } else if (data.disputeResolution === 'Mediation first then courts') {
    sections.push(`## Dispute Resolution

**Informal resolution.** Before filing a claim, you agree to try to resolve the dispute informally by contacting us at ${data.contactEmail}. We will attempt to resolve the dispute informally within 30 days.

**Mediation.** If informal resolution is unsuccessful, the parties agree to submit the dispute to mediation before a mutually agreed-upon mediator. Each party shall bear its own costs of mediation, and the parties shall split the mediator's fees equally.

**Litigation.** If mediation is unsuccessful, either party may pursue the dispute in the courts of competent jurisdiction as described in the Governing Law section below.`);
  } else {
    sections.push(`## Dispute Resolution

Any disputes arising out of or relating to these Terms or the Service shall be resolved exclusively in the courts of competent jurisdiction as described in the Governing Law section below. You agree to submit to the personal jurisdiction of such courts and waive any objection to the convenience of such forum.

Before filing a legal claim, you agree to try to resolve the dispute informally by contacting us at ${data.contactEmail}. We will attempt to resolve the dispute informally within 30 days.`);
  }

  // Governing Law
  const jurisdiction = getJurisdictionText(data.businessLocation);
  sections.push(`## Governing Law

These Terms shall be governed by and construed in accordance with ${jurisdiction}, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.`);

  // Changes to Terms
  sections.push(`## Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised Terms. If you do not agree to the new Terms, please stop using the Service.`);

  // Contact Us
  sections.push(`## Contact Us

If you have any questions about these Terms, please contact us at:

**${data.companyName}**
Email: ${data.contactEmail}${data.contactAddress ? `\nAddress: ${data.contactAddress.replace(/\n/g, ', ')}` : ''}`);

  sections.push(getDisclaimer(isPro));

  return sections.join('\n\n');
}
