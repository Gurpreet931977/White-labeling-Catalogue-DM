import React, { useState, useEffect } from 'react';
import { DrippCatalogueApp } from './apps/DrippCatalogueApp';
import CafeApp from './apps/CafeApp';

export default function App() {
  // Support default 'catalogue' view, or 'cafe-demo' if opened via hash
  const [appMode, setAppMode] = useState(() => {
    return window.location.hash === '#cafe-demo' ? 'cafe-demo' : 'catalogue';
  });

  // Keep hash in sync for clean URL sharing
  useEffect(() => {
    if (appMode === 'cafe-demo') {
      window.location.hash = 'cafe-demo';
    } else {
      if (window.location.hash === '#cafe-demo') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appMode]);

  if (appMode === 'cafe-demo') {
    return <CafeApp onBackToCatalogue={() => setAppMode('catalogue')} />;
  }

  return (
    <DrippCatalogueApp onLaunchCafeDemo={() => setAppMode('cafe-demo')} />
  );
}
