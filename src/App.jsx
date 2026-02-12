import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FormWizard from './components/FormWizard';
import Results from './components/Results';
import { checkProStatus } from './lib/pro';

function App() {
  const [view, setView] = useState('hero'); // 'hero' | 'form' | 'results'
  const [formData, setFormData] = useState(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(checkProStatus());
  }, []);

  function handleGetStarted() {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGenerate(data) {
    setFormData(data);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToForm() {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToHero() {
    setView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {view === 'hero' && <Hero onGetStarted={handleGetStarted} />}
      {view === 'form' && <FormWizard onGenerate={handleGenerate} onBack={handleBackToHero} />}
      {view === 'results' && <Results formData={formData} onBack={handleBackToForm} isPro={isPro} />}
    </div>
  );
}

export default App;
