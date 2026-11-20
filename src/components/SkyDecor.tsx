import React from 'react';
import { motion } from 'motion/react';

/** Soft blue bloom that fades in and sways gently — used as section ornaments. */
export const Bloom: React.FC<{
  className?: string;
  variant?: 1 | 2;
  spin?: boolean;
  delay?: number;
}> = ({ className = '', variant = 1, spin = false, delay = 0 }) => (
  <motion.img
    src={`/sky/flower-${variant}.webp`}
    alt=""
    aria-hidden="true"
    loading="lazy"
    className={`absolute pointer-events-none select-none drop-shadow-[0_10px_20px_rgba(47,106,163,0.25)] ${spin ? 'animate-slow-spin' : 'animate-sway'} ${className}`}
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.4, delay, ease: 'easeOut' }}
  />
);

/** Script heading with animated navy/sky shimmer. */
export const SkyHeading: React.FC<{ children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3' }> = ({
  children,
  className = '',
  as: Tag = 'h2',
}) => <Tag className={`font-script text-sky-shimmer leading-tight pb-2 ${className}`}>{children}</Tag>;

/** Thin sky line with a small diamond ornament in the middle. */
export const SkyOrnament: React.FC<{ label?: string; className?: string }> = ({ label, className = '' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#5b9bd5]" />
    {label ? (
      <span className="text-[10px] md:text-xs text-[#2f6aa3] font-sans font-medium tracking-[0.35em] uppercase whitespace-nowrap">{label}</span>
    ) : (
      <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#C9A54C] to-[#f3e2a9] shadow-[0_0_8px_rgba(201,165,76,0.6)]" />
    )}
    <div className="w-12 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#5b9bd5]" />
  </div>
);
