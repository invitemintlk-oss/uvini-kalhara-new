import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Quote, Send } from 'lucide-react';
import { fetchWishes, submitToGoogleSheet } from '../googleSheets';
import { getGuestFromUrl } from '../guest';
import { Bloom, SkyHeading, SkyOrnament } from './SkyDecor';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
}

const fieldClass =
  'w-full bg-white/80 text-[#1b3f66] border border-[#5b9bd5]/40 rounded-xl px-5 py-4 font-sans focus:ring-2 focus:ring-[#5b9bd5]/40 focus:border-[#2f6aa3] outline-none transition-all placeholder:text-[#24476b]/40';

const formatDate = (d: Date) =>
  isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const sameWish = (a: { name: string; message: string }, b: { name: string; message: string }) =>
  a.name.trim() === b.name.trim() && a.message.trim() === b.message.trim();

export const Wishes: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  // Wishes sent from this browser that the sheet hasn't returned yet (shown immediately)
  const [pending, setPending] = useState<Wish[]>([]);
  // Pre-fill with the invitee's name from the admin-generated link
  const [name, setName] = useState(() => getGuestFromUrl());
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Wall of wishes from the Google Sheet, refreshed every 30 s
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchWishes()
        .then((list) => {
          if (!alive) return;
          setWishes(
            list.map((w, i) => ({ id: `s-${i}-${w.createdAt}`, name: w.name, message: w.message, createdAt: new Date(w.createdAt) }))
          );
        })
        .catch((err) => console.error('Could not load wishes', err));
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // Drop pending wishes once the sheet has them
  useEffect(() => {
    setPending((p) => p.filter((pw) => !wishes.some((w) => sameWish(w, pw))));
  }, [wishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) {
      setError('Please add your name and a wish');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await submitToGoogleSheet('wishes', { name: n.slice(0, 99), wish: m.slice(0, 999), submittedAt: new Date().toISOString() });
      setPending((p) => [{ id: `p-${Date.now()}`, name: n, message: m, createdAt: new Date() }, ...p]);
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error(err);
      setError('Could not send your wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const all = [...pending, ...wishes];
  const visible = showAll ? all : all.slice(0, 6);

  return (
    <section
      id="wishes"
      aria-label="Wishes"
      className="w-full pt-36 pb-44 sm:pt-44 sm:pb-56 md:pt-52 md:pb-64 relative overflow-hidden bg-[#e3eff9]"
      style={{ backgroundImage: `url('/sky/hero-clouds.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.2)_60%,transparent_85%)]" />

      {/* Hanging garland (top) & flower meadow (bottom) framing the wall of wishes */}
      <motion.div
        className="absolute top-0 inset-x-0 h-40 sm:h-56 md:h-64 pointer-events-none"
        style={{
          backgroundImage: "url('/sky/hero-garland.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center top',
          maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
        }}
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-40 sm:h-56 md:h-64 pointer-events-none"
        style={{
          backgroundImage: "url('/sky/hero-meadow-strip.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center bottom',
          maskImage: 'linear-gradient(to top, #000 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 55%, transparent 100%)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <Bloom variant={1} spin className="w-24 md:w-36 top-1/3 -left-10 opacity-80" />
      <Bloom variant={2} spin className="w-24 md:w-32 top-2/3 -right-10 opacity-80" delay={0.3} />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SkyHeading className="text-6xl md:text-8xl">Wishes</SkyHeading>
          <SkyOrnament label="For the happy couple" className="mt-2 [&>div]:w-8 sm:[&>div]:w-16 md:[&>div]:w-24" />
          <p className="text-sm md:text-base text-ink font-serif italic mt-6 max-w-xl px-2 leading-relaxed">
            Leave a blessing, a memory or a few kind words for Uvini &amp; Kalhara as they begin their forever.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="relative glass-sky rounded-[32px] p-6 sm:p-10 space-y-5">
            <div className="absolute inset-3 border border-[#5b9bd5]/25 rounded-[24px] pointer-events-none" />
            <input
              type="text"
              placeholder="Your name"
              maxLength={99}
              className={`${fieldClass} relative`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="relative">
              <textarea
                placeholder="Write your wish..."
                rows={4}
                maxLength={500}
                className={`${fieldClass} resize-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
              <span className="absolute bottom-3 right-4 text-[10px] text-[#24476b]/50">{message.length}/500</span>
            </div>
            {error && <p className="relative text-red-600 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative btn-sky w-full rounded-full py-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] disabled:opacity-50"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.span key="sent" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Heart className="w-4 h-4 fill-white" /> Wish sent with love
                  </motion.span>
                ) : (
                  <motion.span key="send" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Send className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Send Wish'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>
        </motion.div>

        {/* Wall of wishes */}
        {all.length === 0 ? (
          <p className="text-center font-serif italic text-ink/70">Be the first to leave a wish ✨</p>
        ) : (
          <>
            <div className="max-w-5xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
              <AnimatePresence initial={false}>
                {visible.map((w, i) => (
                  <motion.article
                    key={w.id}
                    layout
                    className="break-inside-avoid mb-5 glass-sky rounded-3xl p-6 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }}
                  >
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-[#5b9bd5]/20" />
                    <p className="font-serif italic text-ink text-sm md:text-base leading-relaxed whitespace-pre-line break-words">
                      “{w.message}”
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full btn-sky flex items-center justify-center font-serif text-sm">
                        {w.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#1b3f66] font-medium text-sm truncate">{w.name}</p>
                        <p className="text-[10px] text-[#2f6aa3]/70 tracking-wider uppercase">{formatDate(w.createdAt)}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            {all.length > 6 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="rounded-full border border-[#2f6aa3]/40 bg-white/70 px-8 py-3 text-[#2f6aa3] text-xs uppercase tracking-[0.25em] hover:bg-white transition-all"
                >
                  {showAll ? 'Show fewer' : `View all ${all.length} wishes`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
