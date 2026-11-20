import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Music2, Volume2, VolumeX } from 'lucide-react';
import { FloatingPetals } from './components/FloatingPetals';

import { Countdown } from './components/Countdown';
import { HappyCouple } from './components/HappyCouple';
import { HomecomingDetails } from './components/HomecomingDetails';

import { NoteFromUs } from './components/NoteFromUs';
// Removed Timeline import

import { RSVPForm } from './components/RSVPForm';
import { Wishes } from './components/Wishes';
import { VenueSection } from './components/VenueSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { IntroVideo } from './components/IntroVideo';
import { IntroOverlay } from './components/IntroOverlay';

import { HeroContent } from './components/HeroContent';
import { CornerFlowers } from './components/CornerFlowers';
import { Admin } from './components/Admin';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);

  if (window.location.pathname === '/admin') {
    return <Admin />;
  }
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const weddingDate = new Date('2027-01-20T08:15:00+05:30');

  // Start the song from the beginning. Only marks "playing" via the audio's own onPlay event,
  // so a blocked attempt (browsers block audio without a tap) doesn't stop later retries.
  const startedOnce = useRef(false);
  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    if (!startedOnce.current) audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        startedOnce.current = true;
      })
      .catch((err) => console.log('Audio play blocked until the guest taps: ', err));
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play blocked: ", err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    // Try right away (works where the browser allows autoplay, e.g. returning visitors)…
    startMusic();

    // …otherwise start on the guest's first real gesture. Scroll is NOT a gesture browsers
    // accept for audio, so only tap/click/key are used. Listeners stay until the song is
    // actually playing, then remove themselves.
    const events = ['pointerdown', 'click', 'touchend', 'keydown'] as const;
    const onGesture = () => {
      if (!startedOnce.current) startMusic();
      else cleanup();
    };
    const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onGesture));
    events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
    return cleanup;
  }, []);

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#5b9bd5] selection:text-white overflow-x-hidden bg-brand-ivory">
      <FloatingPetals />
      
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/ordinary.mp3"
        loop
        preload="metadata"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
      />

      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div 
            key="intro" 
            exit={{ opacity: 0 }} 
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50"
          >
            <IntroOverlay
              onOpen={startMusic}
              onEnter={() => {
                setShowIntro(false);
                setShowMain(true);
                startMusic();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showMain && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="relative z-10"
          >
            {/* Music Toggle Button */}
            <button
              onClick={toggleMusic}
              className="fixed bottom-8 right-8 z-[60] w-14 h-14 glass rounded-full flex items-center justify-center text-brand-gold-deep hover:bg-[#2f6aa3] hover:text-white transition-all active:scale-90 shadow-2xl group"
            >
              <div className="absolute inset-0 rounded-full border border-[#5b9bd5]/40 scale-110 group-hover:scale-125 transition-transform" />
              {isMusicPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>



            <HeroContent />

            <Countdown targetDate={weddingDate} />

            <HappyCouple />

            <GallerySection />



            <HomecomingDetails />

            <VenueSection />



            <NoteFromUs />

            <RSVPForm />

            <Wishes />

            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

