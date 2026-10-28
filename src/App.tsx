/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { FloatingHeartsBackground } from './components/FloatingHeartsBackground';
import { QRCodeEntrance } from './components/QRCodeEntrance';
import { LoveExplosion } from './components/LoveExplosion';

export default function App() {
  // Check if opened via QR code scan (e.g. ?surprise=open or #surprise)
  const [screen, setScreen] = useState<'qr' | 'surprise'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('surprise') === 'open' || window.location.hash === '#surprise') {
        return 'surprise';
      }
    }
    // QR code is ALWAYS the default first screen when someone visits!
    return 'qr';
  });

  // Website URL encoded inside the QR code
  const [targetUrl, setTargetUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kuttu_site_published_url');
      if (saved) return saved;

      // If already on a domain
      const origin = window.location.origin;
      if (origin && !origin.includes('localhost')) {
        return origin;
      }
    }
    // Fallback to shared app URL
    return 'https://ais-pre-eiwkvant6aohq2nixvhucb-143710045434.asia-east1.run.app';
  });

  const handleUpdateTargetUrl = (url: string) => {
    setTargetUrl(url);
    try {
      localStorage.setItem('kuttu_site_published_url', url);
    } catch {
      // Ignore
    }
  };

  // Sync hash/search params if switched to surprise
  const handleEnterSurprise = () => {
    setScreen('surprise');
    if (typeof window !== 'undefined' && window.history.pushState) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('surprise', 'open');
      window.history.pushState({}, '', newUrl.toString());
    }
  };

  const handleBackToQR = () => {
    setScreen('qr');
    if (typeof window !== 'undefined' && window.history.pushState) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('surprise');
      window.history.pushState({}, '', newUrl.toString());
    }
  };

  // Listen to browser popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('surprise') === 'open' || window.location.hash === '#surprise') {
        setScreen('surprise');
      } else {
        setScreen('qr');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#2A050E] text-rose-50 overflow-x-hidden selection:bg-rose-500/30 selection:text-white">
      {/* Ambient romantic floating hearts and gradient aura */}
      <FloatingHeartsBackground intensity={screen === 'surprise' ? 'festive' : 'normal'} />

      {/* Screen 1: The QR Code Entrance (Always first when opened) */}
      {screen === 'qr' && (
        <QRCodeEntrance
          targetUrl={targetUrl}
          onUpdateTargetUrl={handleUpdateTargetUrl}
          onEnterSurprise={handleEnterSurprise}
        />
      )}

      {/* Screen 2: The Love Explosion (Unlocked when scanned or entered) */}
      {screen === 'surprise' && (
        <LoveExplosion onBackToQR={handleBackToQR} />
      )}
    </div>
  );
}
