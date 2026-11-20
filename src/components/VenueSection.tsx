import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { Bloom, SkyHeading, SkyOrnament } from './SkyDecor';

// Hotel photo (from "Screenshot 2026-11-20 105944.png"); a sky-blue placeholder shows if it fails to load.
const VENUE_PHOTO = '/venue.webp';
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Earl's+Regency+Hotel+Kandy";

export const VenueSection: React.FC = () => {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section
      id="location"
      aria-label="Location"
      className="w-full py-24 md:py-32 relative overflow-hidden bg-[#eef5fc]"
      style={{ backgroundImage: "url('/sky/bow-sky.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Bloom variant={2} className="w-24 md:w-36 -top-6 -left-8 z-20" />
      <Bloom variant={1} className="w-24 md:w-36 -top-6 -right-8 z-20" delay={0.3} />

      <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SkyHeading className="text-6xl md:text-8xl">The Venue</SkyHeading>
          <SkyOrnament label="Where forever begins" className="mt-2 [&>div]:w-8 sm:[&>div]:w-16 md:[&>div]:w-24" />
        </motion.div>

        <div className="w-full max-w-md space-y-6">
          {/* Photo card */}
          <motion.div
            className="relative rounded-[28px] overflow-hidden aspect-[16/10] glass-sky !p-0 group"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            {photoOk ? (
              <img
                src={VENUE_PHOTO}
                alt="Earl's Regency, Kandy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                loading="lazy"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#cfe5f7] via-[#eaf4fc] to-[#a9cdee] flex flex-col items-center justify-center text-[#2f6aa3]">
                <MapPin className="w-10 h-10 mb-2" strokeWidth={1.2} />
                <span className="font-script text-sky-shimmer text-4xl">Earl's Regency</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/70 pointer-events-none" />
          </motion.div>

          {/* Details card */}
          <motion.div
            className="rounded-[28px] overflow-hidden glass-sky text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <div className="bg-gradient-to-r from-[#cfe5f7] via-[#e3f0fa] to-[#cfe5f7] py-4 border-b border-white">
              <p className="text-sm font-semibold tracking-[0.4em] uppercase text-[#2f6aa3]">Location</p>
            </div>
            <div className="px-6 py-8">
              <p className="font-serif text-xl md:text-2xl text-[#1b3f66] tracking-wide uppercase">The Regent Ballroom</p>
              <p className="mt-2 text-xs md:text-sm tracking-[0.25em] uppercase text-[#2f6aa3] leading-relaxed">
                Earl's Regency
                <br />
                Kandy
              </p>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sky mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase">Live Location</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
