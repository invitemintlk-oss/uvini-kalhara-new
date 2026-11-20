import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Bloom, SkyHeading, SkyOrnament } from './SkyDecor';

export const NoteFromUs: React.FC = () => {
  return (
    <section
      aria-label="A note from us"
      id="note"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-[#d6e6f5]"
      style={{ backgroundImage: `url('/sky/arch-bloom.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/15" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 flex justify-center">
        <motion.div
          className="w-full max-w-2xl relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Bloom variant={1} className="w-24 md:w-32 -top-10 -right-4 md:-right-12 z-20" />
          <Bloom variant={2} className="w-20 md:w-28 -bottom-8 -left-4 md:-left-10 z-20" delay={0.3} />

          <div className="relative glass-sky px-7 py-14 sm:p-14 md:p-20 rounded-t-[220px] rounded-b-[40px] text-center">
            <div className="absolute inset-3 sm:inset-4 border border-[#5b9bd5]/30 rounded-t-[208px] rounded-b-[30px] pointer-events-none" />

            <div className="flex justify-center mb-6 mt-6">
              <Heart className="w-6 h-6 text-[#5b9bd5] fill-[#5b9bd5]/20" strokeWidth={1.2} />
            </div>

            <SkyHeading as="h3" className="text-5xl md:text-7xl mb-8">Our Hearts Are Full</SkyHeading>

            <p className="text-ink leading-[2.1] text-sm md:text-lg font-serif italic px-2 sm:px-6">
              Our wedding day would not be complete without the people who have been part of our journey.
              Thank you for celebrating this beautiful beginning with us and for surrounding us with your love and blessings.
              <br /><br />
              We cannot wait to create memories that we’ll cherish for a lifetime.
            </p>

            <SkyOrnament className="mt-12" />
            <p className="mt-6 text-[#2f6aa3] font-sans tracking-[0.3em] uppercase text-[10px] md:text-xs">With love always</p>
            <p className="font-names text-sky-shimmer text-5xl md:text-6xl mt-2">Uvini &amp; Kalhara</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
