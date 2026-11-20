import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Link as LinkIcon, FileText, Sparkles } from 'lucide-react';
import { PREFIXES, buildInviteLink, buildInviteMessage, getGreeting } from '../guest';

interface Generated {
  prefix: string;
  name: string;
  link: string;
  greeting: string;
  message: string;
}

/** Clipboard API needs a secure context; fall back to a hidden textarea otherwise. */
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
};

const fieldClass =
  'w-full h-12 px-4 rounded-xl border border-[#5b9bd5]/40 bg-white text-[#1b3f66] focus:border-[#2f6aa3] focus:ring-2 focus:ring-[#5b9bd5]/30 outline-none transition-all';
const labelClass = 'text-xs font-semibold text-[#2f6aa3] uppercase tracking-[0.2em]';

export const Admin: React.FC = () => {
  const [prefix, setPrefix] = useState<string>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Invitation Link Generator';
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const canGenerate = guestName.trim().length > 0;
  const isStale = !!generated && (generated.prefix !== prefix || generated.name !== guestName.trim());

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canGenerate) return;
    const link = buildInviteLink(window.location.origin, prefix, guestName);
    setGenerated({
      prefix,
      name: guestName.trim(),
      link,
      greeting: getGreeting(prefix, guestName),
      message: buildInviteMessage(prefix, guestName, link),
    });
  };

  const copy = async (text: string, label: string) => {
    await copyText(text);
    setToast(label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fc] via-white to-[#dbeaf7] text-[#1b3f66] p-4 sm:p-8 md:p-12 font-sans flex items-start sm:items-center justify-center">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-[0_25px_60px_-20px_rgba(31,78,121,0.35)] p-6 sm:p-10 border border-white">
        <div className="text-center mb-8">
          <p className="font-names text-4xl sm:text-5xl text-[#2f6aa3]">Uvini &amp; Kalhara</p>
          <h1 className="mt-2 text-sm sm:text-base font-semibold tracking-[0.25em] uppercase text-[#1b3f66]">
            Invitation Link Generator
          </h1>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label htmlFor="prefix" className={labelClass}>Select Prefix</label>
              <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} className={fieldClass}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="guest" className={labelClass}>Guest Name</label>
              <input
                id="guest"
                type="text"
                placeholder="e.g. Sanjaya"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={fieldClass}
                autoComplete="off"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canGenerate}
            className="btn-sky w-full h-12 rounded-xl font-semibold tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Sparkles className="w-4 h-4" /> Generate Link
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[#5b9bd5]/20 space-y-6">
          {isStale && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              The prefix or name changed — click <strong>Generate Link</strong> again to update.
            </p>
          )}

          {/* Greeting preview */}
          <div className="space-y-2">
            <p className={labelClass}>Greeting Preview</p>
            <div className="min-h-12 px-4 py-3 rounded-xl bg-[#eaf4fc] border border-[#5b9bd5]/25 text-lg font-serif">
              {generated ? generated.greeting : <span className="text-[#24476b]/40 text-sm font-sans">Generate a link to preview</span>}
            </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <p className={labelClass}>Generated Link</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={generated?.link ?? ''}
                placeholder="—"
                onFocus={(e) => e.target.select()}
                className="w-full h-12 px-4 rounded-xl border border-[#5b9bd5]/30 bg-[#f5f9fd] text-[#24476b] text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => generated && copy(generated.link, 'Link copied!')}
                disabled={!generated}
                className="h-12 px-5 shrink-0 flex items-center justify-center gap-2 rounded-xl border border-[#2f6aa3]/40 bg-white text-[#2f6aa3] font-medium hover:bg-[#eaf4fc] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <LinkIcon className="w-4 h-4" /> Copy Link Only
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className={labelClass}>Full Message</p>
            <textarea
              readOnly
              value={generated?.message ?? ''}
              rows={13}
              className="w-full p-4 rounded-xl border border-[#5b9bd5]/30 bg-[#f5f9fd] text-[#24476b] text-sm leading-relaxed outline-none resize-none"
            />
            <button
              type="button"
              onClick={() => generated && copy(generated.message, 'Message copied!')}
              disabled={!generated}
              className="btn-sky w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <FileText className="w-5 h-5" /> Copy Full Message
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              className="flex items-center gap-2 bg-[#1b3f66] text-white px-5 py-3 rounded-full shadow-xl text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Check className="w-4 h-4 text-[#8ec3ec]" /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
