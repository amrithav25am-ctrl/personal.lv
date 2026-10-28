import React, { useMemo } from 'react';

interface FloatingHeartsBackgroundProps {
  intensity?: 'gentle' | 'normal' | 'festive';
}

export const FloatingHeartsBackground: React.FC<FloatingHeartsBackgroundProps> = ({ intensity = 'normal' }) => {
  const count = intensity === 'gentle' ? 12 : intensity === 'festive' ? 26 : 18;

  const particles = useMemo(() => {
    const emojis = ['❤️', '💖', '💕', '✨', '💗', '💋', '🌸'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${Math.random() * 94 + 3}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${7 + Math.random() * 8}s`,
      size: `${14 + Math.random() * 20}px`,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Ambient gradient glow orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[500px] bg-rose-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 left-4 w-[380px] h-[380px] bg-pink-700/15 rounded-full blur-[90px]" />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: p.left,
            bottom: '-40px',
            fontSize: p.size,
            opacity: p.opacity,
            animation: `floatUp ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 0.45;
          }
          50% {
            transform: translateY(-50vh) rotate(15deg) scale(1.1);
          }
          85% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(-105vh) rotate(-15deg) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
