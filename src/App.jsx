import React, { useState, useEffect } from 'react';
import { DrippCatalogueApp } from './apps/DrippCatalogueApp';
import { CafeVariantsPage } from './apps/CafeVariantsPage';
import CafeApp from './apps/CafeApp';

export default function App() {
  // Support 'catalogue' (default), 'cafe-variants', or 'cafe-demo'
  const [appMode, setAppMode] = useState(() => {
    if (window.location.hash === '#cafe-demo') return 'cafe-demo';
    if (window.location.hash === '#cafe-options') return 'cafe-variants';
    return 'catalogue';
  });

  // Keep hash in sync for clean URL sharing & browser back/forward
  useEffect(() => {
    if (appMode === 'cafe-demo') {
      window.location.hash = 'cafe-demo';
    } else if (appMode === 'cafe-variants') {
      window.location.hash = 'cafe-options';
    } else {
      if (window.location.hash === '#cafe-demo' || window.location.hash === '#cafe-options') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cafe-demo') {
        setAppMode('cafe-demo');
      } else if (window.location.hash === '#cafe-options') {
        setAppMode('cafe-variants');
      } else {
        setAppMode('catalogue');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (appMode === 'cafe-demo') {
    return (
      <CafeApp 
        onBackToVariants={() => setAppMode('cafe-variants')}
        onBackToCatalogue={() => setAppMode('catalogue')} 
      />
    );
  }

  if (appMode === 'cafe-variants') {
    return (
      <CafeVariantsPage 
        onBackToCatalogue={() => setAppMode('catalogue')}
        onLaunchTHCDemo={() => setAppMode('cafe-demo')}
      />
    );
  }

  return (
    <DrippCatalogueApp 
      onOpenCafeOptions={() => setAppMode('cafe-variants')}
      onLaunchCafeDemo={() => setAppMode('cafe-demo')} 
    />
  );
}
