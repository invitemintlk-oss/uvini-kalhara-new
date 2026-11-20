import React from 'react';
import { motion } from 'motion/react';
import { MapPin, CalendarHeart, Users, Clock } from 'lucide-react';
import { Bloom, SkyHeading, SkyOrnament } from './SkyDecor';

const timeline = [
  { time: '08:15 AM', label: 'Guest Arrivals' },
  { time: '09:15 AM', label: 'Poruwa Ceremony' },
  { time: '03:30 PM', label: 'Going Away' },
];

export const HomecomingDetails: React.FC = () => {
  return (
    <section
      id="details"
      className="w-full py-24 md:py-32 relative overflow-hidden bg-[#e3eff9]"
      style={{ backgroundImage: `url('/sky/petals-wall.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/60" />
      <Bloom variant={1} spin className="w-40 md:w-56 -top-10 -left-12 opacity-80" />
      <Bloom variant={2} spin className="w-36 md:w-52 bottom-10 -right-12 opacity-80" delay={0.4} />

      <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center">

        {/* Together with our families */}
        <motion.div
          className="relative w-full max-w-3xl glass-sky rounded-[40px] p-8 md:p-14 flex flex-col items-center text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-3 border border-[#5b9bd5]/25 rounded-[30px] pointer-events-none" />
          <div className="w-14 h-14 rounded-full btn-sky flex items-center justify-center mb-5">
            <Users className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <SkyHeading className="text-4xl md:text-6xl mb-8">Together with Our Families</SkyHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {[
              { label: "Bride's Parents", a: 'Mr. Udaya Herath', b: 'Mrs. Nilangani Yatawara' },
              { label: "Groom's Parents", a: 'Mr. Shantha Jayawardhana', b: 'Mrs. Indrani Rathnayake' },
            ].map((p) => (
              <div key={p.label} className="space-y-3">
                <p className="text-[11px] md:text-xs text-[#2f6aa3] font-medium tracking-[0.3em] uppercase">{p.label}</p>
                <p className="font-serif text-[#1b3f66] text-base md:text-lg leading-relaxed">
                  {p.a}<br /><span className="font-script text-2xl text-[#5b9bd5]">&amp;</span><br />{p.b}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SkyHeading className="text-6xl md:text-8xl">The Details</SkyHeading>
          <SkyOrnament label="Reception to follow" className="mt-3" />
        </motion.div>

        {/* Wedding Card */}
        <motion.div
          className="relative w-full max-w-lg glass-sky rounded-t-[200px] rounded-b-[40px] p-8 pt-16 md:p-14 md:pt-20 flex flex-col items-center text-center"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="absolute inset-3 border border-[#5b9bd5]/30 rounded-t-[188px] rounded-b-[30px] pointer-events-none" />
          <Bloom variant={2} className="w-24 -top-10 left-1/2 -translate-x-1/2" />

          <CalendarHeart className="w-9 h-9 text-[#2f6aa3] mb-3" strokeWidth={1.2} />
          <p className="text-[11px] md:text-xs text-[#5b9bd5] tracking-[0.4em] uppercase font-medium">Wednesday</p>
          <p className="font-serif text-[#1b3f66] text-5xl md:text-6xl my-1">20</p>
          <p className="text-sm md:text-base font-serif text-[#2f6aa3] tracking-[0.3em] uppercase mb-10">January 2027</p>

          <h3 className="font-script text-sky-shimmer text-4xl md:text-5xl mb-6">Wedding Timeline</h3>

          <div className="w-full max-w-sm mx-auto mb-12 relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#5b9bd5]/0 via-[#5b9bd5] to-[#5b9bd5]/0" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.label}
                className="relative flex items-center gap-5 py-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              >
                <div className="relative z-10 w-9 h-9 rounded-full bg-white border border-[#5b9bd5]/60 shadow flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#2f6aa3]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 flex items-center justify-between gap-3 border-b border-[#5b9bd5]/25 pb-3">
                  <span className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-ink text-left">{item.label}</span>
                  <span className="font-serif text-[#1b3f66] text-lg md:text-xl whitespace-nowrap">{item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <MapPin className="w-7 h-7 text-[#2f6aa3] mb-2" strokeWidth={1.2} />
          <p className="text-xl md:text-2xl font-serif text-[#1b3f66]">The Regent Ballroom</p>
          <p className="text-[11px] md:text-sm text-[#2f6aa3] tracking-[0.25em] uppercase mt-1 mb-5">Earl's Regency, Kandy</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Earl's+Regency+Hotel+Kandy"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sky inline-flex items-center gap-2 px-8 py-3 rounded-full"
          >
            <MapPin className="w-4 h-4" />
            <span className="font-sans text-[11px] md:text-xs tracking-[0.25em] uppercase">Live Location</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
