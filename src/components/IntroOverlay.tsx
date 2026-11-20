import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getGuestFromUrl } from '../guest';

interface IntroOverlayProps {
  onEnter: () => void;
  /** Called synchronously inside the "Open Invitation" tap so the music may start. */
  onOpen?: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter, onOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const guestName = getGuestFromUrl();

  const handlePlay = () => {
    // Start the song first, inside the tap — browsers only allow audio from a user gesture.
    onOpen?.();
    if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play().catch((e) => {
        console.error('Playback failed', e);
        onEnter();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden bg-[#0f2742]">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/intro-poster.webp"
        onEnded={onEnter}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2742]/60 via-transparent to-[#0f2742]/30 pointer-events-none" />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full flex flex-col justify-end items-center pb-20 h-full text-center px-6"
          >
            {/* Personalised guest name (from the admin-generated link) */}
            {guestName && (
              <motion.div
                className="absolute top-10 sm:top-14 inset-x-0 flex flex-col items-center px-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              >
                <div className="relative max-w-[92vw] sm:max-w-xl">
                  {/* soft glow behind the card */}
                  <div className="absolute -inset-6 rounded-[40px] bg-[#8ec3ec]/40 blur-2xl animate-pulse" aria-hidden="true" />
                  <div className="relative rounded-[28px] px-8 sm:px-12 py-5 sm:py-6 bg-white/15 backdrop-blur-md border border-[#f3e2a9]/70 shadow-[0_15px_50px_rgba(15,39,66,0.55),inset_0_1px_0_rgba(255,255,255,0.5)]">
                    <div className="absolute inset-1.5 rounded-[22px] border border-white/30 pointer-events-none" aria-hidden="true" />
                    <div className="flex items-center justify-center gap-3 mb-2" aria-hidden="true">
                      <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#f3e2a9]" />
                      <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#C9A54C] to-[#f3e2a9] shadow-[0_0_10px_rgba(243,226,169,0.9)]" />
                      <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#f3e2a9]" />
                    </div>
                    <p
                      className="font-serif text-3xl sm:text-5xl leading-tight tracking-wide text-gold-shimmer break-words"
                      style={{ filter: 'drop-shadow(0 3px 10px rgba(15,39,66,0.85))' }}
                    >
                      {guestName}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <p className="font-names text-5xl sm:text-6xl text-white drop-shadow-[0_4px_12px_rgba(15,39,66,0.8)]">Uvini &amp; Kalhara</p>
            <p className="mt-2 mb-8 text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#cfe5f7] drop-shadow">20 · 01 · 2027</p>
            <button
              onClick={handlePlay}
              className="relative font-sans px-10 py-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/60 shadow-[0_10px_40px_rgba(91,155,213,0.6)] hover:bg-white hover:text-[#1b3f66] hover:scale-105 transition-all duration-300 uppercase tracking-[0.3em] text-xs sm:text-sm"
            >
              <span className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-40" />
              Open Invitation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
