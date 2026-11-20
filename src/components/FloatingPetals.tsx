import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Petal {
  id: number;
  x: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  variant: 1 | 2;
  drift: number;
}

/** Gently falling sky-blue blooms across the whole page. */
export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 18 + 16,
        rotation: Math.random() * 360,
        duration: Math.random() * 14 + 18,
        delay: Math.random() * 20,
        variant: (i % 2 === 0 ? 1 : 2) as 1 | 2,
        drift: Math.random() * 40 - 20,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40" aria-hidden="true">
      {petals.map((p) => (
        <motion.img
          key={p.id}
          src={`/sky/flower-${p.variant}.webp`}
          alt=""
          className="absolute top-0 left-0 drop-shadow-[0_4px_8px_rgba(47,106,163,0.3)]"
          style={{ width: p.size, height: p.size }}
          initial={{ x: `${p.x}vw`, y: '-10vh', rotate: p.rotation, opacity: 0 }}
          animate={{
            y: '110vh',
            x: `${p.x + p.drift}vw`,
            rotate: p.rotation + 540,
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
};
