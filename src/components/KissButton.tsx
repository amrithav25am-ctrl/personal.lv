import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playKissSound } from '../utils/audio';

const ROMANTIC_MESSAGES = [
  "MUAHHHH! A sweet kiss right on your cheek! 💋",
  "You make my heart skip a million beats, Kuttu! 💓",
  "One hundred thousand kisses aren't enough for you! 😚",
  "Holding you in my thoughts every single second! 🌸",
  "Forever and always yours, my favorite human! 🫶",
  "Can I hug you tight and never let go? 🫂✨",
  "Sending you the warmest, softest kiss ever! 💋💋",
  "Every moment with you is pure magic! ✨",
  "You have my whole heart, always and forever! 💗",
  "Sending an extra passionate one straight to your lips! 💋🔥",
  "Kuttu, you are the cutest blessing in my entire world! 🥺❤️",
  "Infinite kisses loaded and delivered directly to your heart! 💌",
];

interface FloatingKissParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  angle: number;
}

export const KissButton: React.FC = () => {
  const [kissCount, setKissCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kuttu_kiss_count');
      return saved ? parseInt(saved, 10) : 100; // Start at 100 as in user's prompt example
    } catch {
      return 100;
    }
  });

  const [currentMessage, setCurrentMessage] = useState<string>(
    "Tap the button whenever you need a kiss from me! 💋"
  );
  const [particles, setParticles] = useState<FloatingKissParticle[]>([]);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kuttu_kiss_count', kissCount.toString());
    } catch {
      // Ignore localStorage errors
    }
  }, [kissCount]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // Audio feedback
    playKissSound();

    // Increment count
    const newCount = kissCount + 1;
    setKissCount(newCount);

    // Pick random message
    const randomMsg = ROMANTIC_MESSAGES[Math.floor(Math.random() * ROMANTIC_MESSAGES.length)];
    setCurrentMessage(randomMsg);

    // Get click coordinates
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight * 0.7;

    if ('clientX' in e && e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    // Spawn floating emoji particles from button
    const burstEmojis = ['💋', '💖', '😘', '❤️', '💕', '✨', '😚'];
    const newParticles: FloatingKissParticle[] = Array.from({ length: 6 }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      x: clientX + (Math.random() - 0.5) * 80,
      y: clientY - 10,
      emoji: burstEmojis[Math.floor(Math.random() * burstEmojis.length)],
      size: 24 + Math.random() * 20,
      angle: (Math.random() - 0.5) * 40,
    }));

    setParticles((prev) => [...prev.slice(-25), ...newParticles]);

    // Canvas confetti burst
    confetti({
      particleCount: 18,
      spread: 60,
      startVelocity: 30,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#F59E0B', '#FDE047'],
      shapes: ['circle'],
      scalar: 1.1,
      ticks: 80,
    });

    // Milestone celebration (multiples of 25)
    if (newCount % 25 === 0) {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#E11D48', '#BE123C', '#FCD34D', '#FFF1F2'],
      });
    }

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-6 w-full max-w-md mx-auto px-4">
      {/* Floating particles portal rendered above */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute select-none will-change-transform font-sans"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              animation: 'kissFloat 1.8s cubic-bezier(0.2, 0.8, 0.3, 1) forwards',
              transform: `rotate(${p.angle}deg)`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes kissFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, 0) scale(0.6) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -80px) scale(1.3) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -240px) scale(0.9) rotate(-20deg);
          }
        }
      `}</style>

      {/* Kiss Counter Display: "Kisses sent to Kuttu: 100 💋" */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-950/70 border border-amber-300/40 shadow-inner backdrop-blur-md">
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide uppercase">
            Kisses sent to Kuttu:
          </span>
          <span className="font-serif-title text-xl sm:text-2xl font-bold text-rose-300 tracking-tight">
            {kissCount.toLocaleString()}
          </span>
          <span className="text-lg animate-pulse">💋</span>
        </div>
      </div>

      {/* The Glowing Button: "Tap for kisses, Kuttu! 💋" */}
      <div className="relative group w-full sm:w-auto">
        {/* Glow ambient background aura */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-pink-500 opacity-70 blur-lg group-hover:opacity-100 group-active:opacity-90 transition duration-500 animate-pulse" />

        <button
          onClick={handleTap}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          className={`relative w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-gradient-to-r from-[#BE123C] via-[#E11D48] to-[#9F1239] border-2 border-amber-300 text-white font-serif-title text-lg sm:text-2xl font-bold shadow-[0_10px_35px_rgba(225,29,72,0.5)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer select-none active:scale-95 ${
            isPressing ? 'scale-95 brightness-110' : 'hover:scale-105'
          }`}
        >
          <span>Tap for kisses, Kuttu!</span>
          <span className="text-2xl sm:text-3xl inline-block transition-transform group-hover:rotate-12 group-hover:scale-125">
            💋
          </span>
        </button>
      </div>

      {/* Romantic feedback banner */}
      <div className="mt-5 min-h-[50px] w-full text-center flex items-center justify-center">
        <p className="font-serif italic text-sm sm:text-base text-rose-200/90 bg-rose-950/40 border border-rose-500/20 rounded-2xl px-5 py-2.5 shadow-sm transition-all duration-300 animate-fadeIn">
          "{currentMessage}"
        </p>
      </div>
    </div>
  );
};
