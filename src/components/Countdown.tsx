import React, { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Bloom, SkyHeading, SkyOrnament } from './SkyDecor';

interface CountdownProps {
  targetDate: Date;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeLeft({
        days: Math.max(0, differenceInDays(targetDate, now)),
        hours: Math.max(0, differenceInHours(targetDate, now) % 24),
        minutes: Math.max(0, differenceInMinutes(targetDate, now) % 60),
        seconds: Math.max(0, differenceInSeconds(targetDate, now) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section
      className="w-full pt-10 pb-40 sm:pb-52 md:pb-64 overflow-hidden relative bg-[#eef5fc]"
      style={{ backgroundImage: 'url("/sky/bow-sky.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Watercolour meadow (from "download (8)"), mirror-tiled along the bottom */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-40 sm:h-52 md:h-64 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: "url('/sky/bow-meadow-strip.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center bottom',
          maskImage: 'linear-gradient(to top, #000 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 60%, transparent 100%)',
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      {/* Top corner blooms */}
      <Bloom variant={1} className="w-28 sm:w-36 md:w-48 -top-6 -left-8 md:-top-8 md:-left-10 z-20" />
      <Bloom variant={2} className="w-24 sm:w-32 md:w-44 -top-6 -right-8 md:-top-8 md:-right-10 z-20" delay={0.3} />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center pt-20 md:pt-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SkyHeading className="text-6xl md:text-8xl">Forever Begins In</SkyHeading>
            <SkyOrnament label="A grace-filled occasion" className="mt-4" />
          </motion.div>

          <motion.div
            className="grid grid-cols-4 gap-2 sm:gap-5 md:gap-8 max-w-3xl w-full pt-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {items.map((item) => (
              <div
                key={item.label}
                className="glass-sky flex flex-col items-center justify-center aspect-[3/4] rounded-t-full rounded-b-[28px] relative overflow-hidden"
              >
                <div className="absolute inset-1.5 rounded-t-full rounded-b-[24px] border border-[#5b9bd5]/30 pointer-events-none" />
                <div className="relative h-10 sm:h-16 md:h-20 overflow-hidden flex items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={item.value}
                      className="block font-serif text-3xl sm:text-5xl md:text-6xl text-[#1b3f66]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                      initial={{ y: -30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 30, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="w-6 sm:w-10 h-[1px] bg-[#C9A54C]/70 my-2" />
                <div className="text-[9px] sm:text-xs text-[#2f6aa3] font-medium uppercase tracking-[0.2em]">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
