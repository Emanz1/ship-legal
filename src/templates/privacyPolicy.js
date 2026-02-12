import { formatDate, getAllSelectedServices, SERVICE_PRIVACY_LINKS, includesEU, includesUS, getDisclaimer } from './helpers.js';

export function generatePrivacyPolicy(data, isPro = false) {
  const sections = [];
  const date = formatDate(data.effectiveDate);

  // Header
  sections.push(`# Privacy Policy

**Last updated:** ${date}

${data.companyName} ("we," "us," or "our") operates ${data.productName}${data.websiteUrl ? ` (${data.websiteUrl})` : ''} (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.

Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.`);

  // Information We Collect
  const collectedData = data.dataCollected || [];
  if (collectedData.length > 0) {
    let dataList = collectedData.map(item => `- **${item}**`).join('\n');
    sections.push(`## Information We Collect

We collect information that you voluntarily provide to us when you register for the Service, express interest in obtaining information about us or our products, or otherwise contact us.

### Personal Information

Depending on how you interact with our Service, we may collect the following categories of personal information:

${dataList}

### Information Automatically Collected

When you access the Service, we may automatically collect certain information about your device and usage patterns. This information does not reveal your specific identity but may include device and usage information, such as your browser and device characteristics, operating system, language preferences, referring URLs, information about how and when you use our Service, and other technical information. This information is primarily needed to maintain the security and operation of our Service, and for our internal analytics and reporting purposes.`);
  }

  // How We Use Your Information
  sections.push(`## How We Use Your Information

We use the information we collect or receive for the following purposes:

- **To provide and maintain our Service.** We use your information to deliver the features and functionality of ${data.productName}, process transactions, and manage your account.
- **To improve our Service.** We use aggregated and anonymized usage data to understand how our users interact with the Service, identify areas for improvement, and develop new features.
- **To communicate with you.** We may use your email address to send you service-related notices, including confirmations, invoices, technical notices, updates, security alerts, and support messages.
- **To ensure security.** We use your information to detect, investigate, and prevent fraudulent transactions, unauthorized access, and other illegal activities, and to protect the rights and property of ${data.companyName} and others.
- **To comply with legal obligations.** We may process your information to comply with applicable laws, regulations, legal processes, or enforceable governmental requests.`);

  // Third-Party Services
  const serviceGroups = getAllSelectedServices(data);
  if (serviceGroups.length > 0) {
    let serviceList = '';
    for (const group of serviceGroups) {
      serviceList += `\n### ${group.category}\n\n`;
      for (const service of group.services) {
        const link = SERVICE_PRIVACY_LINKS[service];
        if (link) {
          serviceList += `- **${service}**: We use ${service} for ${group.category.toLowerCase()} services. You can review their privacy policy at [${link}](${link}).\n`;
        } else {
          serviceList += `- **${service}**: We use ${service} for ${group.category.toLowerCase()} services.\n`;
        }
      }
    }

    sections.push(`## Third-Party Services

We use the following third-party service providers to help us operate and improve our Service. These providers may have access to your personal information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
${serviceList}
We encourage you to review the privacy policies of any third-party services that you interact with through our Service. We are not responsible for the privacy practices of these third parties.`);
  }

  // AI & Machine Learning
  if (data.usesAI) {
    const aiProviders = data.aiProviders || [];
    let aiProviderList = '';
    if (aiProviders.length > 0) {
      aiProviderList = '\n\nWe work with the following AI providers:\n\n';
      for (const provider of aiProviders) {
        const link = SERVICE_PRIVACY_LINKS[provider];
        if (link) {
          aiProviderList += `- **${provider}** — [Privacy Policy](${link})\n`;
        } else {
          aiProviderList += `- **${provider}**\n`;
        }
      }
    }

    let trainingPolicy = '';
    if (data.trainsOnUserData === 'No - never') {
      trainingPolicy = `\n\n**Training on your data:** We do **not** use your data to train or fine-tune AI or machine learning models. Your content is processed solely to provide the requested features and is not retained for model improvement purposes.`;
    } else if (data.trainsOnUserData === 'Yes - with consent') {
      trainingPolicy = `\n\n**Training on your data:** We may use your data to improve and train our AI models, but only with your explicit consent. You can opt out of data training at any time through your account settings or by contacting us at ${data.contactEmail}.`;
    } else if (data.trainsOnUserData === 'Yes - anonymized only') {
      trainingPolicy = `\n\n**Training on your data:** We may use anonymized and aggregated data derived from your usage to improve our AI models. This data is stripped of any personally identifiable information and cannot be traced back to individual users.`;
    }

    let retentionPolicy = '';
    if (data.aiDataRetention && data.aiDataRetention !== 'Not stored') {
      retentionPolicy = `\n\n**AI data retention:** Data processed by our AI features is retained for ${data.aiDataRetention.toLowerCase()}${data.aiDataRetention === 'Indefinite' ? '' : ' from the date of processing'}, after which it is automatically deleted.`;
    } else if (data.aiDataRetention === 'Not stored') {
      retentionPolicy = `\n\n**AI data retention:** Data submitted to our AI features is processed in real-time and is not stored after the response has been generated.`;
    }

    sections.push(`## Artificial Intelligence & Machine Learning

${data.productName} incorporates artificial intelligence and machine learning features to enhance your experience. When you use AI-powered features, your inputs may be processed by third-party AI providers to generate responses or perform requested tasks.${aiProviderList}${trainingPolicy}${retentionPolicy}

We implement appropriate technical and organizational safeguards to protect your data during AI processing. However, as with any AI technology, outputs may occasionally be inaccurate or incomplete, and should not be relied upon as the sole basis for important decisions.`);
  }

  // Cookies and Tracking
  if (data.cookieUsage === 'No cookies at all') {
    sections.push(`## Cookies and Tracking Technologies

We do not use cookies or similar tracking technologies on our Service. We have made a deliberate choice to respect your privacy by avoiding cookie-based tracking entirely.${
  data.analyticsServices?.includes('Plausible') ? '\n\nFor analytics, we use Plausible Analytics, which is a privacy-focused analytics tool that does not use cookies and does not collect any personal data.' :
  data.analyticsServices?.includes('Fathom') ? '\n\nFor analytics, we use Fathom Analytics, which is a privacy-focused analytics tool that does not use cookies and does not track personal data.' : ''
}`);
  } else {
    const cookieTypes = {
      'Essential cookies only': `We use only essential cookies that are strictly necessary for the operation of our Service. These cookies enable core functionality such as security, session management, and accessibility. They do not collect any information for marketing or analytics purposes.\n\n**Essential cookies include:**\n- Session cookies to maintain your login state\n- Security cookies to prevent cross-site request forgery\n- Preference cookies to remember your settings`,
      'Analytics + Essential': `We use essential cookies and analytics cookies on our Service.\n\n**Essential cookies** are strictly necessary for the operation of our Service. These cookies enable core functionality such as security, session management, and accessibility.\n\n**Analytics cookies** help us understand how visitors interact with our Service by collecting and reporting information anonymously. This helps us improve our Service over time.`,
      'Marketing + Analytics + Essential': `We use essential, analytics, and marketing cookies on our Service.\n\n**Essential cookies** are strictly necessary for the operation of our Service. These cookies enable core functionality such as security, session management, and accessibility.\n\n**Analytics cookies** help us understand how visitors interact with our Service by collecting and reporting information anonymously.\n\n**Marketing cookies** are used to track visitors across websites to display relevant advertisements and measure the effectiveness of advertising campaigns.`,
    };

    sections.push(`## Cookies and Tracking Technologies

${cookieTypes[data.cookieUsage] || 'We use cookies on our Service.'}

**Managing cookies:** Most web browsers allow you to control cookies through their settings. You can typically find these settings in the "Options" or "Preferences" menu of your browser. You can set your browser to refuse cookies or to alert you when cookies are being sent. Please note that if you disable essential cookies, some features of the Service may not function properly.

For more information about cookies and how to manage them, visit [www.allaboutcookies.org](https://www.allaboutcookies.org/).`);
  }

  // Data Retention
  sections.push(`## Data Retention

We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.

When your personal information is no longer required for these purposes, we will securely delete or anonymize it. If deletion is not possible (for example, because your personal information has been stored in backup archives), we will securely store your personal information and isolate it from any further processing until deletion is possible.`);

  // Your Rights
  let rightsSection = `## Your Rights

Depending on your location, you may have certain rights regarding your personal information:`;

  if (includesEU(data)) {
    rightsSection += `

### Rights Under the GDPR (European Economic Area)

If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). These include:

- **Right of access:** You have the right to request copies of your personal data.
- **Right to rectification:** You have the right to request that we correct any information you believe is inaccurate or complete any information you believe is incomplete.
- **Right to erasure:** You have the right to request that we erase your personal data, under certain conditions.
- **Right to restrict processing:** You have the right to request that we restrict the processing of your personal data, under certain conditions.
- **Right to data portability:** You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.
- **Right to object:** You have the right to object to our processing of your personal data, under certain conditions.
- **Right to withdraw consent:** If we are relying on your consent to process your personal data, you have the right to withdraw your consent at any time.

To exercise any of these rights, please contact us at ${data.contactEmail}. We will respond to your request within 30 days.`;
  }

  if (includesUS(data)) {
    rightsSection += `

### Rights Under CCPA/CPRA (California, United States)

If you are a California resident, the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information:

- **Right to know:** You have the right to request that we disclose what personal information we have collected, used, disclosed, and sold about you in the last 12 months.
- **Right to delete:** You have the right to request the deletion of your personal information that we have collected, subject to certain exceptions.
- **Right to opt-out of sale:** You have the right to opt out of the sale of your personal information. We do not sell your personal information.
- **Right to non-discrimination:** We will not discriminate against you for exercising any of your CCPA/CPRA rights.
- **Right to correct:** You have the right to request that we correct inaccurate personal information about you.
- **Right to limit use of sensitive personal information:** You have the right to limit the use and disclosure of your sensitive personal information.

To exercise any of these rights, please contact us at ${data.contactEmail}. We will verify your identity before fulfilling your request and respond within 45 days.`;
  }

  if (!includesEU(data) && !includesUS(data)) {
    rightsSection += `

You generally have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your personal information
- Object to the processing of your personal information
- Request a copy of your personal information in a portable format

To exercise any of these rights, please contact us at ${data.contactEmail}.`;
  }

  sections.push(rightsSection);

  // Children's Privacy
  sections.push(`## Children's Privacy

Our Service is not directed to children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you become aware that your child has provided us with personal information, please contact us at ${data.contactEmail}. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers promptly.`);

  // International Data Transfers
  if (includesEU(data)) {
    sections.push(`## International Data Transfers

Your information may be transferred to, stored, and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.

If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we ensure that transfers of personal data to countries outside of these regions are subject to appropriate safeguards, such as Standard Contractual Clauses approved by the European Commission, or other legally recognized transfer mechanisms.

By using our Service, you consent to the transfer of your information to the United States and other countries where we or our service providers operate.`);
  }

  // Changes
  sections.push(`## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.

We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the Service after any modifications to this Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide by the modified Privacy Policy.`);

  // Contact Us
  sections.push(`## Contact Us

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

**${data.companyName}**
Email: ${data.contactEmail}${data.contactAddress ? `\nAddress: ${data.contactAddress.replace(/\n/g, ', ')}` : ''}`);

  sections.push(getDisclaimer(isPro));

  return sections.join('\n\n');
}
