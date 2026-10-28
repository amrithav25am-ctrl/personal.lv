import React, { useEffect, useState, useId } from 'react';
import QRCode from 'qrcode';
import { Heart, Sparkles, Copy, Check, Download, Settings2, ExternalLink } from 'lucide-react';
import { playMagicalChime } from '../utils/audio';

interface QRCodeEntranceProps {
  onEnterSurprise: () => void;
  targetUrl: string;
  onUpdateTargetUrl: (url: string) => void;
}

export const QRCodeEntrance: React.FC<QRCodeEntranceProps> = ({
  onEnterSurprise,
  targetUrl,
  onUpdateTargetUrl,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState(targetUrl);
  const [error, setError] = useState<string | null>(null);
  const urlInputId = useId();

  // Full scan URL with the surprise parameter
  const scanUrl = React.useMemo(() => {
    try {
      const u = new URL(targetUrl);
      u.searchParams.set('surprise', 'open');
      return u.toString();
    } catch {
      return targetUrl.includes('?') 
        ? `${targetUrl}&surprise=open` 
        : `${targetUrl}?surprise=open`;
    }
  }, [targetUrl]);

  // Generate ultra-crisp, reliable black-and-white QR Code
  useEffect(() => {
    QRCode.toDataURL(scanUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 480,
      color: {
        dark: '#000000', // Pure black for 100% optical camera readability
        light: '#FFFFFF', // Pure white
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        setError('Could not generate QR code for this URL');
      });
  }, [scanUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'kuttu-love-surprise-qr.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    let formatted = customInputUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    onUpdateTargetUrl(formatted);
    setShowUrlModal(false);
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 md:py-12">
      {/* Tiny floating sparkles around the screen */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Sparkles className="absolute top-16 left-[15%] w-6 h-6 text-amber-300/40 animate-pulse" />
        <Sparkles className="absolute bottom-24 right-[12%] w-5 h-5 text-rose-300/50 animate-pulse" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-1/2 left-[8%] w-4 h-4 text-amber-200/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <Sparkles className="absolute top-1/3 right-[10%] w-5 h-5 text-rose-200/40 animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Main Champagne-Gold & White Romantic Card */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Soft back aura glow */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-300/30 via-rose-500/25 to-amber-300/30 blur-xl opacity-90 transition duration-1000" />

        <div className="relative bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-amber-200/90 text-neutral-800 text-center transition-all duration-300 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)]">
          
          {/* Corner Champagne-Gold Flourishes */}
          <div className="absolute top-3 left-4 text-amber-400/40 select-none text-xs">✦</div>
          <div className="absolute top-3 right-4 text-amber-400/40 select-none text-xs">✦</div>
          <div className="absolute bottom-3 left-4 text-amber-400/40 select-none text-xs">✦</div>
          <div className="absolute bottom-3 right-4 text-amber-400/40 select-none text-xs">✦</div>

          {/* Heading 1: "Hey, Kuttu! ❤️" */}
          <div className="space-y-1 mb-5">
            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight text-[#4A081A] flex items-center justify-center gap-2">
              Hey, Kuttu! <span className="inline-block animate-bounce text-rose-600">❤️</span>
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-rose-800/80 font-normal">
              I have a little surprise for you...
            </p>
          </div>

          {/* QR Code Container with Champagne-Gold Border & Delicate External Heart Decoration */}
          <div className="relative my-4 inline-block group">
            {/* External Heart Ornament above the QR code (strictly outside to avoid scanning interference) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center bg-white px-2.5 py-0.5 rounded-full border border-amber-300 shadow-sm">
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
            </div>

            {/* Pristine White QR Card Frame with champagne-gold border */}
            <div className="p-3 bg-white rounded-2xl border-2 border-amber-300/80 shadow-md">
              {qrDataUrl ? (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt="Scan me, my love!"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
              ) : error ? (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-xs text-rose-600 p-4">
                  {error}
                </div>
              ) : (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-rose-400">
                  <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* External Heart Ornament below the QR code */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center bg-white px-2 rounded-full border border-amber-200">
              <span className="text-[10px] text-amber-600 font-medium">✨ SCAN ✨</span>
            </div>
          </div>

          {/* Prompt Below QR Code: "Scan me, my love! 💋" */}
          <div className="mt-5 space-y-2">
            <p className="font-serif-title text-xl sm:text-2xl font-bold text-[#680E27] tracking-wide">
              Scan me, my love! <span className="inline-block hover:scale-125 transition-transform cursor-default">💋</span>
            </p>
            <p className="text-xs text-stone-500 font-light">
              Point your phone camera to reveal what my heart is hiding
            </p>

            {/* Small Animated Heart Underneath */}
            <div className="pt-2 flex justify-center">
              <div className="relative inline-flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-heart-beat drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Test / Direct Open Button (Allows instant preview without requiring a 2nd phone) */}
          <div className="mt-6 pt-5 border-t border-rose-100/90 flex flex-col gap-2.5">
            <button
              onClick={() => {
                playMagicalChime();
                onEnterSurprise();
              }}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-[#881337] text-white font-medium shadow-md hover:shadow-lg hover:from-rose-800 hover:to-rose-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>Tap here to open surprise directly</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            {/* Secondary Controls: Copy link, Download QR, Set URL */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 hover:text-rose-700 transition-colors py-1 px-2 rounded-md hover:bg-rose-50 cursor-pointer"
                title="Copy full surprise link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex items-center gap-1 hover:text-rose-700 transition-colors py-1 px-2 rounded-md hover:bg-rose-50 cursor-pointer"
                title="Download high-res QR code image to print or share"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomInputUrl(targetUrl);
                  setShowUrlModal(true);
                }}
                className="flex items-center gap-1 hover:text-rose-700 transition-colors py-1 px-2 rounded-md hover:bg-rose-50 cursor-pointer"
                title="Configure the final published website URL"
              >
                <Settings2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Set Website URL</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Target URL configuration modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-amber-200 text-stone-800 relative">
            <h3 className="font-serif-title text-xl font-bold text-[#4A081A] mb-2">
              Website URL for QR Code
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              When Kuttu scans this QR code with his phone, his browser will open this website address. If you publish or use a custom domain later, update it here anytime.
            </p>

            <form onSubmit={handleSaveCustomUrl} className="space-y-4">
              <div>
                <label htmlFor={urlInputId} className="block text-xs font-semibold text-stone-700 mb-1">
                  Destination URL
                </label>
                <input
                  id={urlInputId}
                  type="text"
                  value={customInputUrl}
                  onChange={(e) => setCustomInputUrl(e.target.value)}
                  placeholder="https://your-custom-site.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Fast presets */}
              <div className="text-[11px] text-stone-500 space-y-1">
                <span className="font-semibold block text-stone-600">Quick options:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        setCustomInputUrl(window.location.origin);
                      }
                    }}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 cursor-pointer text-xs"
                  >
                    Current Browser Origin
                  </button>
                  {typeof window !== 'undefined' && window.location.href.includes('asia-east1.run.app') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomInputUrl(window.location.origin);
                      }}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Applet Cloud URL
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg cursor-pointer shadow"
                >
                  Regenerate QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gentle footer note */}
      <div className="mt-6 text-center text-rose-200/60 text-xs">
        Crafted with infinite love for Kuttu ❤️
      </div>
    </div>
  );
};
