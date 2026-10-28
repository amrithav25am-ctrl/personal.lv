import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { KissButton } from './KissButton';
import { Sparkles, Heart, QrCode, Volume2, VolumeX, RotateCcw, Mail } from 'lucide-react';
import { playKissSound, playMagicalChime, isSoundEnabled, toggleSound } from '../utils/audio';

const FLOATING_SURPRISE_MESSAGES = [
  "MUAHHHH! 💋💋💋",
  "I LOVE YOU, KUTTU! ❤️",
  "YOU ARE MY FAVORITE PERSON! 🫶",
  "MILLION KISSES FOR YOU! 😚💋",
  "YOU HAVE MY WHOLE HEART! 💗",
  "FOREVER MY KUTTU! ❤️🔥",
];

interface TapParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  color: string;
}

interface LoveExplosionProps {
  onBackToQR: () => void;
}

export const LoveExplosion: React.FC<LoveExplosionProps> = ({ onBackToQR }) => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [tapParticles, setTapParticles] = useState<TapParticle[]>([]);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showLetter, setShowLetter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger grand love explosion fireworks with confetti
  const fireGrandExplosion = useCallback(() => {
    playMagicalChime();

    // Multi-stage confetti burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FF1493', '#FF69B4', '#FFD700', '#FFFFFF'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#E11D48', '#FDA4AF', '#F59E0B'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      colors: ['#9F1239', '#FB7185', '#FDE047'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#FFE4E6', '#F43F5E', '#FBBF24'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  // Sequence messages one by one on mount
  useEffect(() => {
    // Initial big explosion
    const t0 = setTimeout(() => {
      fireGrandExplosion();
    }, 400);

    // Show floating messages one by one
    const timers: NodeJS.Timeout[] = [];
    FLOATING_SURPRISE_MESSAGES.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, idx]);
      }, 900 + idx * 700);
      timers.push(timer);
    });

    return () => {
      clearTimeout(t0);
      timers.forEach(clearTimeout);
    };
  }, [fireGrandExplosion]);

  // Tap anywhere on screen to release hearts & kisses at touch/click coordinates
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Don't trigger if tapping buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e && e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    playKissSound();

    const emojis = ['💋', '❤️', '💖', '💗', '💕', '🫶', '✨'];
    const newItems: TapParticle[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clientX + (Math.random() - 0.5) * 60,
      y: clientY + (Math.random() - 0.5) * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 22 + Math.random() * 18,
      color: '#FB7185',
    }));

    setTapParticles((prev) => [...prev.slice(-30), ...newItems]);

    // Mini confetti at tap point
    confetti({
      particleCount: 10,
      spread: 45,
      startVelocity: 20,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      },
      colors: ['#F43F5E', '#FDA4AF', '#FCD34D'],
      ticks: 60,
    });

    setTimeout(() => {
      setTapParticles((prev) => prev.filter((p) => !newItems.some((ni) => ni.id === p.id)));
    }, 1600);
  };

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleScreenTap}
      onTouchStart={handleScreenTap}
      className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 cursor-crosshair select-none z-10"
    >
      {/* Top Floating Tap Particles */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {tapParticles.map((p) => (
          <span
            key={p.id}
            className="absolute font-sans will-change-transform"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              animation: 'tapParticleRise 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes tapParticleRise {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -100px) scale(1.25) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -190px) scale(0.85) rotate(-15deg);
          }
        }
      `}</style>

      {/* Top Bar with Controls */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-4xl mx-auto py-2">
        <button
          onClick={onBackToQR}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-amber-300/30 text-rose-200 hover:text-white hover:bg-rose-900/70 text-xs sm:text-sm font-medium transition cursor-pointer backdrop-blur-md"
          title="Back to the main QR Code entrance"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-300" />
          <span>Show QR Code</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLetter(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/60 border border-amber-300/30 text-rose-200 hover:text-white text-xs sm:text-sm transition cursor-pointer backdrop-blur-md"
            title="Read Love Letter for Kuttu"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Love Letter</span>
          </button>

          <button
            onClick={fireGrandExplosion}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/60 border border-amber-300/30 text-rose-200 hover:text-white text-xs sm:text-sm transition cursor-pointer backdrop-blur-md"
            title="Replay the grand love explosion fireworks"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Explosion</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full bg-rose-950/60 border border-amber-300/30 text-rose-200 hover:text-white transition cursor-pointer backdrop-blur-md"
            title={soundOn ? 'Mute romantic chimes' : 'Unmute romantic chimes'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6 max-w-4xl mx-auto w-full">
        
        {/* Animated Greeting Banner */}
        <div className="space-y-3 sm:space-y-4 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs sm:text-sm uppercase tracking-widest font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Surprise Unlocked</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Heading 1: "KUTTUUUU! ❤️🥹" */}
          <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 drop-shadow-[0_4px_16px_rgba(244,63,94,0.6)] tracking-wide">
            KUTTUUUU! <span className="inline-block animate-bounce text-rose-500">❤️</span>
            <span className="inline-block transition-transform hover:scale-125">🥹</span>
          </h1>

          {/* Heading 2: "I LOVE YOU SOOOOO MUCH! 💋💗" */}
          <p className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-bold text-rose-200 drop-shadow-md">
            I LOVE YOU SOOOOO MUCH! <span className="inline-block animate-pulse text-3xl sm:text-4xl">💋💗</span>
          </p>

          <p className="text-xs sm:text-sm text-rose-300/70 font-light max-w-md mx-auto pt-1">
            Tap anywhere on the screen to sprinkle hearts & kisses!
          </p>
        </div>

        {/* Floating Animated Romantic Messages */}
        <div className="w-full max-w-2xl my-6 grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
          {FLOATING_SURPRISE_MESSAGES.map((msg, index) => {
            const isVisible = visibleMessages.includes(index);
            return (
              <div
                key={index}
                className={`transform transition-all duration-700 ease-out p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/80 to-[#3B0712]/90 border border-amber-300/40 shadow-lg backdrop-blur-md flex items-center justify-center gap-2 ${
                  isVisible
                    ? 'opacity-100 scale-100 translate-y-0 shadow-[0_4px_20px_rgba(212,175,55,0.15)]'
                    : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
                }`}
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0 animate-pulse" />
                <span className="font-serif-title font-semibold text-rose-100 text-sm sm:text-base tracking-wide">
                  {msg}
                </span>
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0 animate-pulse" />
              </div>
            );
          })}
        </div>

        {/* The Interactive Glowing Kiss Button Section */}
        <KissButton />
      </main>

      {/* Love Letter Modal */}
      {showLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative bg-[#FFF9F2] text-stone-800 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border-2 border-amber-300">
            {/* Top decorative seal */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-rose-700 border-2 border-amber-300 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>

            <div className="text-center mb-4 pt-2">
              <span className="font-script text-3xl sm:text-4xl text-rose-800 block">Dearest Kuttu,</span>
              <div className="w-24 h-0.5 bg-amber-400 mx-auto mt-1" />
            </div>

            <div className="font-serif text-sm sm:text-base leading-relaxed text-stone-700 space-y-3 max-h-[60vh] overflow-y-auto px-1">
              <p>
                From the moment you entered my life, every day has felt brighter, softer, and filled with smiles. You are my calm in every storm, my biggest joy, and my absolute favorite person in the entire universe.
              </p>
              <p>
                No matter where life takes us, remember that my heart belongs completely to you. Thank you for being you, for your kindness, your sweet smile, and all the love you bring.
              </p>
              <p className="font-bold text-rose-800">
                Forever and always, your number one lover! ❤️💋
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLetter(false)}
                className="px-5 py-2 rounded-xl bg-rose-700 text-white font-medium text-sm hover:bg-rose-800 transition cursor-pointer shadow-md"
              >
                Close with Love 💌
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Bottom Footer Reminder */}
      <footer className="relative z-10 text-center py-2 text-rose-300/60 text-xs">
        <p>Made especially for Kuttu • Scan again anytime with the QR code ❤️</p>
      </footer>
    </div>
  );
};
