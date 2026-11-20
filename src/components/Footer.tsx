import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-16 bg-gradient-to-b from-[#1b3f66] to-[#0f2742] text-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#8ec3ec] to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-[#5b9bd5]/25 blur-[100px] rounded-full pointer-events-none" />
      <img src="/sky/flower-2.webp" alt="" aria-hidden="true" className="absolute -right-10 -bottom-10 w-40 opacity-30 animate-slow-spin pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-[#8ec3ec]" strokeWidth={1.2} />
              <span className="font-display italic text-5xl text-[#cfe5f7] tracking-wide">U &amp; K</span>
            </div>
            <p className="text-white/70 leading-[1.8] font-serif tracking-wide text-sm md:text-base pr-4">
              Thank you for visiting our wedding website and being part of our love story. The honor of your presence would mean the world to us.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-sans font-semibold text-[#8ec3ec] uppercase tracking-[0.2em]">Quick Links</h3>
            <div className="w-8 h-[1px] bg-[#8ec3ec]/50" />
            <ul className="space-y-4">
              {[
                ['details', 'Details'],
                ['rsvp', 'RSVP'],
                ['wishes', 'Wishes'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollToSection(id)} className="text-white/70 hover:text-[#8ec3ec] transition-colors tracking-[0.1em] text-sm uppercase">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-sans font-semibold text-[#8ec3ec] uppercase tracking-[0.2em]">Wedding Details</h3>
            <div className="w-8 h-[1px] bg-[#8ec3ec]/50" />
            <div className="space-y-3 text-white/70 tracking-[0.1em] text-sm">
              <p>Wednesday, 20th January 2027</p>
              <p>The Regent Ballroom, Earl's Regency, Kandy</p>
              <p className="text-[#cfe5f7] italic mt-4 font-serif tracking-widest text-xs">#Uvini&amp;Kalhara2027</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center flex flex-col items-center">
          <p className="text-[#8ec3ec]/80 text-[10px] md:text-xs tracking-[0.2em] uppercase">© 2027 Uvini &amp; Kalhara's Wedding</p>
          <p className="text-white/40 text-[10px] mt-4 tracking-[0.1em]">
            Want a beautiful wedding website like this? Create yours with{' '}
            <a target="_blank" rel="noreferrer" className="text-[#8ec3ec] hover:text-white transition-colors underline underline-offset-2" href="https://wa.me/94707819074">
              invitemint
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
