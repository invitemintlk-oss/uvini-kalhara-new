import React, { useState } from 'react';
import { submitToGoogleSheet } from '../googleSheets';
import { getGuestFromUrl } from '../guest';
import { Calendar, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Bloom, SkyOrnament } from './SkyDecor';

const fieldClass =
  'w-full bg-white/80 text-[#1b3f66] border border-[#5b9bd5]/40 rounded-xl px-5 py-4 font-sans focus:ring-2 focus:ring-[#5b9bd5]/40 focus:border-[#2f6aa3] outline-none transition-all placeholder:text-[#24476b]/40';
const labelClass = 'block text-[#2f6aa3] text-xs font-semibold uppercase tracking-[0.2em] mb-3';

const Chevron = () => (
  <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#2f6aa3] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const RSVPForm: React.FC = () => {
  // Pre-fill with the invitee's name from the admin-generated link (still editable)
  const [name, setName] = useState(() => getGuestFromUrl());
  const [attending, setAttending] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!attending) {
      setError('Please let us know if you can attend');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const inviteType = searchParams.get('invite') || 'both';

      const status = attending === 'yes' ? 'Accepts' : 'Declines';
      await submitToGoogleSheet('rsvp', {
        name,
        status,
        guestCount: attending === 'yes' ? guestCount : '0',
        message,
        inviteType,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="w-full py-24 md:py-32 relative overflow-hidden bg-[#e3f0fa]"
      style={{ backgroundImage: `url('/sky/ornate-frame.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/20" />
      <Bloom variant={2} spin className="w-36 md:w-48 -top-8 -right-10 opacity-90" />
      <Bloom variant={1} spin className="w-32 md:w-44 -bottom-8 -left-10 opacity-90" delay={0.3} />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Elegant RSVP monogram: script "Please", spaced serif capitals with gold diamonds, script "kindly respond" */}
          <div className="relative flex flex-col items-center">
            <motion.img
              src="/sky/flower-1.webp"
              alt=""
              aria-hidden="true"
              className="w-14 md:w-16 mb-1 drop-shadow-md animate-slow-spin"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            />
            <motion.p
              className="font-script text-sky-shimmer text-4xl md:text-5xl leading-none -mb-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Please
            </motion.p>
            <h2 className="flex items-center gap-2 sm:gap-4 md:gap-5 font-display font-light uppercase" aria-label="RSVP">
              {['R', 'S', 'V', 'P'].map((ch, i) => (
                <React.Fragment key={ch}>
                  {i > 0 && (
                    <motion.span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 bg-gradient-to-br from-[#C9A54C] to-[#f3e2a9] shadow-[0_0_8px_rgba(201,165,76,0.7)]"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                    />
                  )}
                  <motion.span
                    aria-hidden="true"
                    className="text-sky-shimmer text-6xl sm:text-7xl md:text-8xl leading-none !px-0"
                    initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.35 + i * 0.15, ease: 'easeOut' }}
                  >
                    {ch}
                  </motion.span>
                </React.Fragment>
              ))}
            </h2>
            <motion.p
              className="font-script text-[#C9A54C] text-2xl md:text-3xl -mt-2 md:-mt-3 -rotate-3 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              kindly respond
            </motion.p>
          </div>
          <SkyOrnament label="By December 20, 2026" className="mt-2" />
          <p className="text-sm md:text-base text-ink font-serif italic mt-6 max-w-xl px-4 leading-relaxed">
            Where forever begins, and we’d love for you to be there. Please let us know if you'll be joining us on our special day.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            {[
              { n: 'Kalhara', t: '0756299807', tel: '+94756299807' },
              { n: 'Uvini', t: '0703203824', tel: '+94703203824' },
            ].map((c) => (
              <a
                key={c.n}
                href={`tel:${c.tel}`}
                className="glass-sky inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-[#1b3f66] hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4 text-[#2f6aa3]" />
                <span className="text-xs tracking-[0.2em] uppercase font-medium">{c.n}</span>
                <span className="font-serif">{c.t}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative glass-sky p-7 sm:p-12 md:p-16 rounded-[40px]">
            <div className="absolute inset-3 sm:inset-4 border border-[#5b9bd5]/25 rounded-[30px] pointer-events-none" />

            {submitted ? (
              <div className="text-center py-10 relative">
                <p className="font-script text-sky-shimmer text-6xl mb-6">Thank you!</p>
                <p className="text-sm md:text-base font-sans text-ink tracking-widest uppercase">Your response has been lovingly recorded.</p>
              </div>
            ) : (
              <form onSubmit={handleRSVP} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>Guest Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Eg: Namal Perera"
                      className={fieldClass}
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Will you attend?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { v: 'yes', l: 'Yes, I will attend' },
                        { v: 'no', l: 'No, I cannot' },
                      ].map((o) => (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => setAttending(o.v)}
                          disabled={isSubmitting}
                          className={`rounded-xl px-3 py-4 text-xs sm:text-sm font-medium tracking-wide border transition-all ${
                            attending === o.v
                              ? 'btn-sky border-transparent'
                              : 'bg-white/80 text-[#1b3f66] border-[#5b9bd5]/40 hover:border-[#2f6aa3]'
                          }`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {attending === 'yes' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className={labelClass}>Number of Guests (including yourself)</label>
                    <div className="relative">
                      <select
                        required
                        className={`${fieldClass} appearance-none pr-10`}
                        name="guestCount"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        disabled={isSubmitting}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest (Just me)' : 'Guests'}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className={labelClass}>Message (Optional)</label>
                  <textarea
                    name="message"
                    maxLength={250}
                    rows={4}
                    className={`${fieldClass} resize-none`}
                    placeholder="Leave the couple a beautiful note!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {error && <p className="text-red-600 text-sm font-sans text-center tracking-wide">{error}</p>}

                <div className="pt-4 space-y-4">
                  <button
                    type="submit"
                    className="btn-sky w-full rounded-full py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit RSVP'}
                  </button>

                  <a
                    href="https://www.google.com/calendar/render?action=TEMPLATE&text=Uvini+%26+Kalhara+Wedding&dates=20270120T024500Z/20270120T100000Z&details=We+are+excited+to+celebrate+with+you!&location=The+Regent+Ballroom,+Earl's+Regency,+Kandy&sf=true&output=xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center rounded-full border border-[#2f6aa3]/40 bg-white/70 py-4 text-[#2f6aa3] hover:bg-white transition-all"
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">Add to Google Calendar</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
