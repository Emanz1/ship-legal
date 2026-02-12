import { useState, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import JSZip from 'jszip';
import { generatePrivacyPolicy } from '../templates/privacyPolicy';
import { generateTermsOfService } from '../templates/termsOfService';
import { generateCookiePolicy } from '../templates/cookiePolicy';
import { CHECKOUT_URL, PRICE, redeemPromoCode } from '../lib/pro';

const TABS = [
  { id: 'privacy', label: 'Privacy Policy', filename: 'privacy-policy.md' },
  { id: 'terms', label: 'Terms of Service', filename: 'terms-of-service.md' },
  { id: 'cookie', label: 'Cookie Policy', filename: 'cookie-policy.md' },
];

export default function Results({ formData, onBack, isPro: initialPro }) {
  const [activeTab, setActiveTab] = useState('privacy');
  const [copyState, setCopyState] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isPro, setIsPro] = useState(initialPro);

  function handlePromoRedeem() {
    if (redeemPromoCode(promoCode)) {
      setIsPro(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code');
    }
  }

  const documents = useMemo(() => ({
    privacy: generatePrivacyPolicy(formData, isPro),
    terms: generateTermsOfService(formData, isPro),
    cookie: generateCookiePolicy(formData, isPro),
  }), [formData, isPro]);

  const renderedHTML = useMemo(() => ({
    privacy: DOMPurify.sanitize(marked.parse(documents.privacy)),
    terms: DOMPurify.sanitize(marked.parse(documents.terms)),
    cookie: DOMPurify.sanitize(marked.parse(documents.cookie)),
  }), [documents]);

  async function copyToClipboard(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyState(prev => ({ ...prev, [key]: false })), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyState(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyState(prev => ({ ...prev, [key]: false })), 2000);
    }
  }

  async function downloadAll() {
    const zip = new JSZip();
    zip.file('privacy-policy.md', documents.privacy);
    zip.file('terms-of-service.md', documents.terms);
    zip.file('cookie-policy.md', documents.cookie);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.productName?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'legal'}-documents.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const activeDoc = documents[activeTab];
  const activeHTML = renderedHTML[activeTab];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1e3a5f] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Edit answers
          </button>
          <div className="flex items-center gap-3">
            {isPro && (
              <span className="text-xs font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">PRO</span>
            )}
            <span className="text-sm font-bold text-[#1e3a5f]">ShipLegal</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Privacy badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#059669] text-sm font-medium px-4 py-2 rounded-full border border-emerald-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Your data never leaves your browser. All documents are generated entirely client-side.
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#2563eb] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-[#1e3a5f]">Upgrade to Pro</p>
                  <p className="text-xs text-gray-500">Remove ShipLegal branding, get AI/LLM clauses, API terms, and zip downloads.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handlePromoRedeem()}
                  placeholder="Promo code"
                  className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-blue-200"
                />
                <button
                  onClick={handlePromoRedeem}
                  className="inline-flex items-center gap-1 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                >
                  Redeem
                </button>
              </div>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-2 text-right">{promoError}</p>}
          </div>
        )}

        {/* Title + Download */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Your Documents Are Ready</h1>
            <p className="text-sm text-gray-500 mt-1">
              Generated for <strong>{formData.productName}</strong> by {formData.companyName}
            </p>
          </div>
          {isPro ? (
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d4a] transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download All (.zip)
            </button>
          ) : (
            <a
              href={CHECKOUT_URL}
              className="flex items-center gap-2 bg-gray-100 text-gray-400 px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Download All (Pro)
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#2563eb] text-[#2563eb]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document preview */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 border-t-0">
          {/* Copy buttons bar */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50">
            <CopyButton
              label="Copy Markdown"
              copied={copyState[`${activeTab}-md`]}
              onClick={() => copyToClipboard(activeDoc, `${activeTab}-md`)}
            />
            <CopyButton
              label="Copy HTML"
              copied={copyState[`${activeTab}-html`]}
              onClick={() => copyToClipboard(activeHTML, `${activeTab}-html`)}
            />
          </div>

          {/* Rendered content */}
          <div
            className="prose prose-sm sm:prose max-w-none px-6 sm:px-10 py-8 [&_h1]:text-[#1e3a5f] [&_h2]:text-[#1e3a5f] [&_h3]:text-[#1e3a5f] [&_a]:text-[#2563eb] [&_strong]:text-gray-800 [&_table]:text-sm [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2 [&_th]:border [&_td]:border [&_th]:border-gray-200 [&_td]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: activeHTML }}
          />
        </div>
      </div>
    </div>
  );
}

function CopyButton({ label, copied, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
        copied
          ? 'bg-emerald-50 border-emerald-200 text-[#059669]'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
