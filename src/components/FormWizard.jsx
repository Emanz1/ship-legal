import { useState } from 'react';
import StepIndicator from './StepIndicator';

const TOTAL_STEPS = 8;

const DATA_COLLECTION_OPTIONS = [
  'Email addresses',
  'Names',
  'Payment information (credit cards via processor)',
  'Physical addresses',
  'Phone numbers',
  'Usage/analytics data',
  'User-generated content',
  'Files/uploads',
  'IP addresses',
  'Device information',
];

const THIRD_PARTY_SERVICES = {
  payment: { label: 'Payment Processing', options: ['Stripe', 'Paddle', 'PayPal', 'Lemon Squeezy', 'None'] },
  analytics: { label: 'Analytics', options: ['Google Analytics', 'Plausible', 'Fathom', 'PostHog', 'Mixpanel', 'None'] },
  email: { label: 'Email Service', options: ['SendGrid', 'Mailchimp', 'Resend', 'Postmark', 'ConvertKit', 'None'] },
  auth: { label: 'Authentication', options: ['Auth0', 'Clerk', 'Supabase Auth', 'Firebase Auth', 'Custom', 'None'] },
  hosting: { label: 'Hosting', options: ['Vercel', 'AWS', 'Google Cloud', 'Railway', 'Fly.io', 'Other'] },
  errorTracking: { label: 'Error Tracking', options: ['Sentry', 'LogRocket', 'Datadog', 'None'] },
};

const AI_PROVIDERS = ['OpenAI', 'Anthropic', 'Google AI', 'Mistral', 'Cohere', 'Self-hosted', 'Other'];

const PRODUCT_TYPES = ['SaaS', 'Mobile App', 'API Service', 'Marketplace', 'Other'];

const COOKIE_OPTIONS = [
  'Essential cookies only',
  'Analytics + Essential',
  'Marketing + Analytics + Essential',
  'No cookies at all',
];

const JURISDICTION_OPTIONS = ['United States', 'European Union', 'United Kingdom', 'Canada', 'Australia', 'Other'];

const USER_LOCATION_OPTIONS = ['United States', 'European Union', 'United Kingdom', 'Canada', 'Australia', 'Worldwide'];

const DISPUTE_OPTIONS = ['Arbitration', 'Courts', 'Mediation first then courts'];

function getDefaultFormData() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  return {
    // Step 1
    productName: '',
    companyName: '',
    websiteUrl: '',
    productType: 'SaaS',
    // Step 2
    dataCollected: [],
    // Step 3
    paymentServices: [],
    analyticsServices: [],
    emailServices: [],
    authServices: [],
    hostingServices: [],
    errorTrackingServices: [],
    // Step 4
    usesAI: false,
    aiProviders: [],
    trainsOnUserData: 'No - never',
    aiDataRetention: 'Not stored',
    // Step 5
    hasAPI: false,
    requiresAuth: false,
    hasRateLimits: false,
    apiDataAccess: 'Read only',
    // Step 6
    cookieUsage: 'Essential cookies only',
    // Step 7
    businessLocation: 'United States',
    userLocations: [],
    // Step 8
    contactEmail: '',
    contactAddress: '',
    effectiveDate: dateStr,
    disputeResolution: 'Arbitration',
  };
}

export default function FormWizard({ onGenerate, onBack }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(getDefaultFormData);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleArrayItem(field, item) {
    setFormData(prev => {
      const arr = prev[field] || [];
      if (item === 'None') {
        return { ...prev, [field]: arr.includes('None') ? [] : ['None'] };
      }
      const withoutNone = arr.filter(i => i !== 'None');
      return {
        ...prev,
        [field]: withoutNone.includes(item)
          ? withoutNone.filter(i => i !== item)
          : [...withoutNone, item],
      };
    });
  }

  function validateStep() {
    const newErrors = {};
    if (step === 0) {
      if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    }
    if (step === 1) {
      if (formData.dataCollected.length === 0) newErrors.dataCollected = 'Select at least one type of data you collect';
    }
    if (step === 7) {
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) newErrors.contactEmail = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleSubmit() {
    if (!validateStep()) return;
    onGenerate(formData);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1e3a5f] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </button>
          <span className="text-sm font-bold text-[#1e3a5f]">ShipLegal</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {step === 0 && <Step1Product formData={formData} updateField={updateField} errors={errors} />}
          {step === 1 && <Step2Data formData={formData} toggleArrayItem={toggleArrayItem} errors={errors} />}
          {step === 2 && <Step3Services formData={formData} toggleArrayItem={toggleArrayItem} />}
          {step === 3 && <Step4AI formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />}
          {step === 4 && <Step5API formData={formData} updateField={updateField} />}
          {step === 5 && <Step6Cookies formData={formData} updateField={updateField} />}
          {step === 6 && <Step7Jurisdiction formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />}
          {step === 7 && <Step8Contact formData={formData} updateField={updateField} errors={errors} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                step === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Previous
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-[#2563eb] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors cursor-pointer"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#059669] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#047857] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate Documents
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step Components ---------- */

function StepHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#1e3a5f]">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, error, type = 'text', required }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const errorId = `${id}-error`;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors outline-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-gray-300 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100'
        }`}
      />
      {error && <p id={errorId} className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectInput({ label, value, onChange, options, helpText }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-colors outline-none bg-white"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {helpText && <p className="text-gray-400 text-xs mt-1">{helpText}</p>}
    </div>
  );
}

function CheckboxGroup({ items, selected, onToggle, columns = 2, error }) {
  return (
    <div>
      <div className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {items.map(item => (
          <label
            key={item}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(item)
                ? 'border-[#2563eb] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 rounded accent-[#2563eb]"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange, description }) {
  const labelId = `toggle-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div className="flex items-start gap-3 mb-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-0.5 cursor-pointer ${
          checked ? 'bg-[#2563eb]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <div>
        <span id={labelId} className="text-sm font-medium text-gray-700">{label}</span>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function Step1Product({ formData, updateField, errors }) {
  return (
    <>
      <StepHeader
        title="Your Product"
        description="Tell us about your SaaS product. This information will appear throughout your legal documents."
      />
      <TextInput
        label="Product Name"
        value={formData.productName}
        onChange={v => updateField('productName', v)}
        placeholder="e.g. Acme Analytics"
        error={errors.productName}
        required
      />
      <TextInput
        label="Company / Legal Entity Name"
        value={formData.companyName}
        onChange={v => updateField('companyName', v)}
        placeholder="e.g. Acme Inc."
        error={errors.companyName}
        required
      />
      <TextInput
        label="Website URL"
        value={formData.websiteUrl}
        onChange={v => updateField('websiteUrl', v)}
        placeholder="e.g. https://acme.com"
      />
      <SelectInput
        label="Product Type"
        value={formData.productType}
        onChange={v => updateField('productType', v)}
        options={PRODUCT_TYPES}
      />
    </>
  );
}

function Step2Data({ formData, toggleArrayItem, errors }) {
  return (
    <>
      <StepHeader
        title="Data Collection"
        description="Select all types of user data your product collects. This determines the 'Information We Collect' section of your Privacy Policy."
      />
      <CheckboxGroup
        items={DATA_COLLECTION_OPTIONS}
        selected={formData.dataCollected}
        onToggle={item => toggleArrayItem('dataCollected', item)}
        error={errors.dataCollected}
      />
    </>
  );
}

function Step3Services({ formData, toggleArrayItem }) {
  return (
    <>
      <StepHeader
        title="Third-Party Services"
        description="Select the services you use. Each selected service will be listed in your Privacy Policy with a link to their privacy policy."
      />
      {Object.entries(THIRD_PARTY_SERVICES).map(([key, { label, options }]) => {
        const fieldMap = {
          payment: 'paymentServices',
          analytics: 'analyticsServices',
          email: 'emailServices',
          auth: 'authServices',
          hosting: 'hostingServices',
          errorTracking: 'errorTrackingServices',
        };
        const field = fieldMap[key];
        return (
          <div key={key} className="mb-6 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
            <div className="flex flex-wrap gap-2">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleArrayItem(field, opt)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                    formData[field]?.includes(opt)
                      ? opt === 'None'
                        ? 'border-gray-400 bg-gray-100 text-gray-600'
                        : 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function Step4AI({ formData, updateField, toggleArrayItem }) {
  return (
    <>
      <StepHeader
        title="AI & LLM Usage"
        description="If your product uses AI or LLM features, we'll include appropriate disclosures in your policies."
      />
      <Toggle
        label="My product uses AI / LLM features"
        checked={formData.usesAI}
        onChange={v => updateField('usesAI', v)}
        description="This includes any use of AI APIs like OpenAI, Anthropic, Google AI, etc."
      />

      {formData.usesAI && (
        <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Providers Used</h3>
            <CheckboxGroup
              items={AI_PROVIDERS}
              selected={formData.aiProviders}
              onToggle={item => toggleArrayItem('aiProviders', item)}
              columns={3}
            />
          </div>
          <SelectInput
            label="Do you train models on user data?"
            value={formData.trainsOnUserData}
            onChange={v => updateField('trainsOnUserData', v)}
            options={['No - never', 'Yes - with consent', 'Yes - anonymized only']}
          />
          <SelectInput
            label="How long is AI-processed data retained?"
            value={formData.aiDataRetention}
            onChange={v => updateField('aiDataRetention', v)}
            options={['Not stored', '30 days', '90 days', '1 year', 'Indefinite']}
          />
        </div>
      )}
    </>
  );
}

function Step5API({ formData, updateField }) {
  return (
    <>
      <StepHeader
        title="API Access"
        description="If you offer a public or partner API, we'll add API-specific terms to your Terms of Service."
      />
      <Toggle
        label="My product has a public/partner API"
        checked={formData.hasAPI}
        onChange={v => updateField('hasAPI', v)}
      />

      {formData.hasAPI && (
        <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-2">
          <Toggle
            label="API requires authentication"
            checked={formData.requiresAuth}
            onChange={v => updateField('requiresAuth', v)}
            description="API keys, OAuth tokens, or other credentials required"
          />
          <Toggle
            label="API has rate limits"
            checked={formData.hasRateLimits}
            onChange={v => updateField('hasRateLimits', v)}
            description="You enforce request limits per user/key"
          />
          <SelectInput
            label="API Data Access Level"
            value={formData.apiDataAccess}
            onChange={v => updateField('apiDataAccess', v)}
            options={['Read only', 'Read/Write', 'Full access']}
          />
        </div>
      )}
    </>
  );
}

function Step6Cookies({ formData, updateField }) {
  return (
    <>
      <StepHeader
        title="Cookies & Tracking"
        description="Select your cookie usage level. This determines your Cookie Policy content."
      />
      <div className="space-y-2">
        {COOKIE_OPTIONS.map(opt => (
          <label
            key={opt}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              formData.cookieUsage === opt
                ? 'border-[#2563eb] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="cookieUsage"
              value={opt}
              checked={formData.cookieUsage === opt}
              onChange={() => updateField('cookieUsage', opt)}
              className="mt-0.5 accent-[#2563eb]"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">{opt}</span>
              {opt === 'No cookies at all' && (
                <p className="text-xs text-gray-400 mt-0.5">
                  You will receive a "Cookie-Free Declaration" instead of a full cookie policy.
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </>
  );
}

function Step7Jurisdiction({ formData, updateField, toggleArrayItem }) {
  return (
    <>
      <StepHeader
        title="Jurisdiction"
        description="Where your business is located and where your users are determines which regulations apply (GDPR, CCPA, etc.)."
      />
      <SelectInput
        label="Where is your business located?"
        value={formData.businessLocation}
        onChange={v => updateField('businessLocation', v)}
        options={JURISDICTION_OPTIONS}
      />
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Where are your users located?</label>
        <CheckboxGroup
          items={USER_LOCATION_OPTIONS}
          selected={formData.userLocations}
          onToggle={item => toggleArrayItem('userLocations', item)}
          columns={3}
        />
        {(formData.userLocations.includes('European Union') || formData.userLocations.includes('Worldwide')) && (
          <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <svg className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="text-xs text-[#2563eb]">
              GDPR sections will be automatically included in your Privacy Policy.
            </span>
          </div>
        )}
        {(formData.userLocations.includes('United States') || formData.userLocations.includes('Worldwide')) && (
          <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <svg className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="text-xs text-[#2563eb]">
              CCPA/CPRA sections will be automatically included in your Privacy Policy.
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function Step8Contact({ formData, updateField, errors }) {
  return (
    <>
      <StepHeader
        title="Contact & Details"
        description="Final details for your legal documents. The contact email will appear at the bottom of each document."
      />
      <TextInput
        label="Contact Email"
        value={formData.contactEmail}
        onChange={v => updateField('contactEmail', v)}
        placeholder="e.g. legal@acme.com"
        error={errors.contactEmail}
        type="email"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Contact Address <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={formData.contactAddress}
          onChange={e => updateField('contactAddress', e.target.value)}
          placeholder="123 Main St, Suite 100, San Francisco, CA 94105"
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-colors outline-none resize-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Effective Date</label>
        <input
          type="date"
          value={formData.effectiveDate}
          onChange={e => updateField('effectiveDate', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-colors outline-none"
        />
      </div>
      <SelectInput
        label="Dispute Resolution Method"
        value={formData.disputeResolution}
        onChange={v => updateField('disputeResolution', v)}
        options={DISPUTE_OPTIONS}
        helpText="Determines how disagreements are resolved in your Terms of Service."
      />
    </>
  );
}
