import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkyHeading, SkyOrnament } from './SkyDecor';

// Web-sized copies of the photos in public/pre (made by resizing; originals untouched)
const PHOTOS = Array.from({ length: 7 }, (_, i) => `/gallery/photo-${i + 1}.webp`);

export const GallerySection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  // Start fetching the full-size photo as soon as a thumbnail is touched/hovered,
  // so the lightbox opens instantly.
  const warmFull = (i: number) => {
    const img = new Image();
    img.src = PHOTOS[i];
  };

  const step = (dir: 1 | -1) =>
    setOpen((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length));

  useEffect(() => {
    if (open === null) return;
    // Pre-fetch neighbours so next/previous switch instantly
    warmFull((open + 1) % PHOTOS.length);
    warmFull((open - 1 + PHOTOS.length) % PHOTOS.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Two copies back-to-back so the strip loops seamlessly (animates 0 → -50%)
  const strip = [...PHOTOS, ...PHOTOS];

  return (
    <section
      id="gallery"
      aria-label="Gallery"
      className="w-full py-24 md:py-32 relative overflow-hidden bg-[#eaf4fc]"
      style={{ backgroundImage: "url('/sky/hero-clouds.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <motion.div
        className="text-center mb-12 md:mb-16 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <SkyHeading className="text-6xl md:text-8xl">Our Moments</SkyHeading>
        <SkyOrnament label="Captured with love" className="mt-2 [&>div]:w-8 sm:[&>div]:w-16 md:[&>div]:w-24" />
      </motion.div>

      {/* Edge fades so photos glide in and out softly */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 z-10 bg-gradient-to-r from-[#eaf4fc] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 z-10 bg-gradient-to-l from-[#eaf4fc] to-transparent pointer-events-none" />

        <div className="group overflow-hidden py-4">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
            {strip.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(i % PHOTOS.length)}
                onPointerEnter={() => warmFull(i % PHOTOS.length)}
                onTouchStart={() => warmFull(i % PHOTOS.length)}
                aria-hidden={i >= PHOTOS.length}
                tabIndex={i >= PHOTOS.length ? -1 : 0}
                className={`relative shrink-0 mr-4 md:mr-6 h-80 sm:h-[26rem] md:h-[32rem] aspect-[4/5] rounded-[24px] overflow-hidden bg-white p-1.5 shadow-[0_20px_45px_-15px_rgba(31,78,121,0.45)] transition-transform duration-500 hover:-translate-y-2 ${
                  i % 2 ? 'md:translate-y-6' : ''
                }`}
              >
                <img
                  src={src.replace('/photo-', '/thumb-')}
                  alt={`Uvini & Kalhara photo ${(i % PHOTOS.length) + 1}`}
                  // Thumbs are tiny (~90 KB for all 7). Lazy-loading makes them pop in late
                  // in a sideways marquee, so load them straight away.
                  loading="eager"
                  decoding="async"
                  width={720}
                  height={900}
                  draggable={false}
                  className="w-full h-full object-cover rounded-[19px] bg-gradient-to-br from-[#dbe9f6] to-[#eef5fc]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[#0f2742]/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.img
              key={open}
              src={PHOTOS[open]}
              alt={`Uvini & Kalhara photo ${open + 1}`}
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl border-4 border-white"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button aria-label="Close" onClick={() => setOpen(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30">
              <X className="w-5 h-5" />
            </button>
            <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 md:left-8 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 md:right-8 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30">
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
