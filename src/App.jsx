import React, { useState, useEffect } from 'react';
import { DrippCatalogueApp } from './apps/DrippCatalogueApp';
import { CafeVariantsPage } from './apps/CafeVariantsPage';
import { WhiteLabelStudio } from './apps/WhiteLabelStudio';
import CafeApp from './apps/CafeApp';

export default function App() {
  // Support 'catalogue' (default), 'studio', 'cafe-variants', or 'cafe-demo'
  const [appMode, setAppMode] = useState(() => {
    if (window.location.hash === '#cafe-demo') return 'cafe-demo';
    if (window.location.hash === '#cafe-options') return 'cafe-variants';
    if (window.location.hash === '#studio' || window.location.hash === '#editor') return 'studio';
    return 'catalogue';
  });

  // Keep hash in sync for clean URL sharing & browser back/forward
  useEffect(() => {
    if (appMode === 'cafe-demo') {
      window.location.hash = 'cafe-demo';
    } else if (appMode === 'cafe-variants') {
      window.location.hash = 'cafe-options';
    } else if (appMode === 'studio') {
      window.location.hash = 'studio';
    } else {
      if (
        window.location.hash === '#cafe-demo' || 
        window.location.hash === '#cafe-options' || 
        window.location.hash === '#studio' || 
        window.location.hash === '#editor'
      ) {
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
      } else if (window.location.hash === '#studio' || window.location.hash === '#editor') {
        setAppMode('studio');
      } else {
        setAppMode('catalogue');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. Live THC Cafe Web App
  if (appMode === 'cafe-demo') {
    return (
      <CafeApp 
        onBackToVariants={() => setAppMode('cafe-variants')}
        onBackToCatalogue={() => setAppMode('catalogue')} 
      />
    );
  }

  // 2. Dedicated 4-Model Cafe Architecture Choice Page
  if (appMode === 'cafe-variants') {
    return (
      <CafeVariantsPage 
        onBackToCatalogue={() => setAppMode('catalogue')}
        onLaunchTHCDemo={() => setAppMode('cafe-demo')}
      />
    );
  }

  // 3. Dedicated White-Label Studio & Editor Panel
  if (appMode === 'studio') {
    return (
      <WhiteLabelStudio 
        onBackToCatalogue={() => setAppMode('catalogue')}
        onLaunchLiveDemo={() => setAppMode('cafe-demo')}
      />
    );
  }

  // 4. Main Minimal Dripp Media White-Label Catalogue
  return (
    <DrippCatalogueApp 
      onOpenStudio={() => setAppMode('studio')}
      onOpenCafeOptions={() => setAppMode('cafe-variants')}
      onLaunchCafeDemo={() => setAppMode('cafe-demo')} 
    />
  );
}
