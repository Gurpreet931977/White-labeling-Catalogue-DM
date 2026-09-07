import React, { useState, useEffect } from 'react';
import { DrippCatalogueApp } from './apps/DrippCatalogueApp';
import { CafeVariantsPage } from './apps/CafeVariantsPage';
import { WhiteLabelStudio } from './apps/WhiteLabelStudio';
import CafeApp from './apps/CafeApp';
import { GamifiedLoyaltyApp } from './apps/GamifiedLoyaltyApp';
import { StudioPasswordGate, isStudioAuthenticated } from './components/studio/StudioPasswordGate';

export default function App() {
  // Support 'catalogue' (default), 'studio', 'cafe-variants', 'cafe-demo', or 'loyalty-app'
  const [appMode, setAppMode] = useState(() => {
    if (window.location.hash === '#loyalty' || window.location.hash === '#loyalty-pass') return 'loyalty-app';
    if (window.location.hash === '#cafe-demo') return 'cafe-demo';
    if (window.location.hash === '#cafe-options') return 'cafe-variants';
    if (window.location.hash === '#studio' || window.location.hash === '#editor') return 'studio';
    return 'catalogue';
  });

  // Studio password gate — persists for this browser tab session only
  const [studioAuthed, setStudioAuthed] = useState(() => isStudioAuthenticated());

  // Keep hash in sync for clean URL sharing & browser back/forward
  useEffect(() => {
    if (appMode === 'loyalty-app') {
      window.location.hash = 'loyalty';
    } else if (appMode === 'cafe-demo') {
      window.location.hash = 'cafe-demo';
    } else if (appMode === 'cafe-variants') {
      window.location.hash = 'cafe-options';
    } else if (appMode === 'studio') {
      window.location.hash = 'studio';
    } else {
      if (
        window.location.hash === '#loyalty' ||
        window.location.hash === '#loyalty-pass' ||
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
      // In-page section jumps should never switch appMode
      if (window.location.hash.startsWith('#section-')) {
        return;
      }

      if (window.location.hash === '#loyalty' || window.location.hash === '#loyalty-pass') {
        setAppMode('loyalty-app');
      } else if (window.location.hash === '#cafe-demo') {
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

  // Listen to model switches globally
  useEffect(() => {
    const handleModelChange = (e) => {
      const model = e?.detail?.model;
      if (model === 'gamified-loyalty') {
        setAppMode('loyalty-app');
      } else if (model && appMode === 'loyalty-app') {
        setAppMode('cafe-demo');
      }
    };
    window.addEventListener('thc_model_change', handleModelChange);
    return () => window.removeEventListener('thc_model_change', handleModelChange);
  }, [appMode]);

  // 1. Dedicated Gamified Coffee & Bakery Loyalty Pass (ARCHETYPE 07)
  if (appMode === 'loyalty-app') {
    return (
      <GamifiedLoyaltyApp
        onBackToVariants={() => setAppMode('cafe-variants')}
        onBackToCatalogue={() => setAppMode('catalogue')}
      />
    );
  }

  // 2. Live THC Cafe Web App
  if (appMode === 'cafe-demo') {
    return (
      <CafeApp 
        onBackToVariants={() => setAppMode('cafe-variants')}
        onBackToCatalogue={() => setAppMode('catalogue')} 
      />
    );
  }

  // 3. Dedicated 7-Model Cafe Architecture Choice Page
  if (appMode === 'cafe-variants') {
    return (
      <CafeVariantsPage 
        onBackToCatalogue={() => setAppMode('catalogue')}
        onLaunchTHCDemo={() => setAppMode('cafe-demo')}
        onLaunchLoyaltyApp={() => setAppMode('loyalty-app')}
      />
    );
  }

  // 3. Dedicated White-Label Studio & Editor Panel — MASTER PASSWORD PROTECTED
  if (appMode === 'studio') {
    if (!studioAuthed) {
      return (
        <StudioPasswordGate
          onAuthenticated={() => setStudioAuthed(true)}
          onBack={() => setAppMode('catalogue')}
        />
      );
    }
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
