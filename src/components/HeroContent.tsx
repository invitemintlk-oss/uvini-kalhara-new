import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SkyOrnament } from './SkyDecor';

/**
 * Hero built from layers of the "download (7)" watercolour:
 *  - cloud sky as the base
 *  - hanging garland (top) that drops in and sways
 *  - flower meadow (bottom) that rises up
 * Strips are mirror-tiled so they repeat seamlessly at any screen width.
 */
const stripStyle = (src: string, fade: 'down' | 'up'): React.CSSProperties => {
  const mask = `linear-gradient(to ${fade === 'down' ? 'bottom' : 'top'}, #000 62%, transparent 100%)`;
  return {
    backgroundImage: `url('${src}')`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'auto 100%',
    backgroundPosition: `center ${fade === 'down' ? 'top' : 'bottom'}`,
    maskImage: mask,
    WebkitMaskImage: mask,
  };
};

const ArchFrame: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <motion.path
      d="M2,99 L2,30 A48,29 0 0 1 98,30 L98,99 Z"
      fill="none"
      stroke="#5b9bd5"
      strokeWidth="1.2"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.6, delay: 0.4, ease: 'easeInOut' }}
    />
    <motion.path
      d="M4.5,97 L4.5,31 A45.5,27 0 0 1 95.5,31 L95.5,97 Z"
      fill="none"
      stroke="#C9A54C"
      strokeOpacity="0.7"
      strokeWidth="0.8"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.6, delay: 0.9, ease: 'easeInOut' }}
    />
  </svg>
);

const Sparkles: React.FC = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 15 + Math.random() * 70,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 2 + 2.5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none z-[5]" aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.9)]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

export const HeroContent: React.FC = () => {
  // Parallax: garland lifts away, meadow sinks, content drifts slower
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const garlandY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const meadowY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Hero"
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center bg-[#e6f1fb]"
    >
      {/* Sky base */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: "url('/sky/hero-clouds.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.3)_45%,transparent_75%)]" />

      <Sparkles />

      {/* Hanging garland */}
      <motion.div className="absolute top-0 inset-x-0 z-20 pointer-events-none" style={{ y: garlandY }}>
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="h-[17vh] sm:h-[22vh] md:h-[28vh] origin-top animate-garland-sway -mx-4"
            style={stripStyle('/sky/hero-garland.webp', 'down')}
          />
        </motion.div>
      </motion.div>

      {/* Rising meadow */}
      <motion.div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none" style={{ y: meadowY }}>
        <motion.div
          className="h-[17vh] sm:h-[22vh] md:h-[30vh] origin-bottom"
          style={stripStyle('/sky/hero-meadow-strip.webp', 'up')}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-30 w-full flex flex-col items-center px-4 pt-[12vh] pb-[13vh] sm:pt-[16vh] sm:pb-[18vh] md:pt-[20vh] md:pb-[24vh]"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="relative w-[92%] max-w-[21rem] sm:max-w-md md:max-w-lg px-4 sm:px-10 pt-20 sm:pt-24 pb-10 text-center">
          {/* Soft rotating halo of light behind the arch */}
          <div
            className="absolute -inset-16 sm:-inset-24 -z-10 rounded-full opacity-70 blur-2xl animate-slow-spin pointer-events-none"
            style={{ background: 'conic-gradient(from 0deg, rgba(142,195,236,0.0), rgba(142,195,236,0.55), rgba(255,255,255,0.0), rgba(201,165,76,0.35), rgba(142,195,236,0.0), rgba(142,195,236,0.5), rgba(142,195,236,0.0))' }}
            aria-hidden="true"
          />
          {/* Frosted glass arch body */}
          <motion.div
            className="absolute inset-0 bg-white/45 backdrop-blur-md shadow-[0_30px_70px_-20px_rgba(31,78,121,0.45)]"
            style={{ borderRadius: '50% 50% 0 0 / 29% 29% 0 0' }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: 'easeOut' }}
            aria-hidden="true"
          />
          <ArchFrame />

          {/* Floral crown at the arch apex */}
          <motion.div
            className="absolute -top-9 sm:-top-11 left-1/2 -translate-x-1/2 flex items-end pointer-events-none"
            initial={{ opacity: 0, y: -20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 2.6, type: 'spring', bounce: 0.35 }}
            aria-hidden="true"
          >
            <img src="/sky/flower-2.webp" alt="" className="w-11 sm:w-14 -mr-3 rotate-[-25deg] drop-shadow-md" />
            <img src="/sky/flower-1.webp" alt="" className="w-[4.5rem] sm:w-24 relative z-10 animate-slow-spin drop-shadow-lg" />
            <img src="/sky/flower-2.webp" alt="" className="w-11 sm:w-14 -ml-3 rotate-[25deg] drop-shadow-md" />
          </motion.div>

          {/* Blooms at the arch base corners */}
          <img src="/sky/flower-1.webp" alt="" aria-hidden="true" className="absolute -bottom-6 -left-7 w-16 sm:w-20 animate-sway drop-shadow-lg pointer-events-none" />
          <img src="/sky/flower-2.webp" alt="" aria-hidden="true" className="absolute -bottom-5 -right-6 w-14 sm:w-[4.5rem] animate-sway drop-shadow-lg pointer-events-none" style={{ animationDelay: '-3s' }} />

          <div className="relative">
            <motion.p
              className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-sans text-[#2f6aa3] font-medium"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              We invite you to celebrate
            </motion.p>
            <motion.p
              className="mt-1 font-serif italic text-ink text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              our wedding
            </motion.p>

            <div className="my-3 sm:my-5 flex flex-col items-center">
              <motion.h1
                className="font-names text-sky-shimmer text-[3.6rem] sm:text-7xl md:text-8xl leading-[1.15]"
                initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, delay: 1.8, ease: 'easeOut' }}
              >
                Uvini
              </motion.h1>
              <motion.span
                className="font-names text-4xl sm:text-5xl text-[#C9A54C] leading-none -my-2 drop-shadow-[0_2px_6px_rgba(201,165,76,0.5)]"
                initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 2.4, type: 'spring', bounce: 0.4 }}
              >
                &amp;
              </motion.span>
              <motion.h1
                className="font-names text-sky-shimmer text-[3.6rem] sm:text-7xl md:text-8xl leading-[1.15]"
                initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, delay: 2.1, ease: 'easeOut' }}
              >
                Kalhara
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.8 }}
            >
              <SkyOrnament />
              <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5 font-serif text-[#1b3f66]">
                <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase border-y border-[#5b9bd5]/50 py-1.5 w-20 sm:w-24">Wednesday</span>
                <span className="flex flex-col items-center leading-none">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#2f6aa3]">January</span>
                  <span className="text-4xl sm:text-5xl my-0.5">20</span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#2f6aa3]">2027</span>
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase border-y border-[#5b9bd5]/50 py-1.5 w-20 sm:w-24">08:15 AM</span>
              </div>
              <p className="mt-5 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-ink leading-relaxed">
                The Regent Ballroom<br />Earl's Regency · Kandy
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-4 inset-x-0 z-30 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <div className="flex flex-col items-center animate-bounce text-[#1b3f66] bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5">
          <p className="text-[10px] font-sans tracking-[0.25em] uppercase">Scroll</p>
          <ChevronDown className="h-4 w-4" />
        </div>
      </motion.div>
    </section>
  );
};
