import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound, playSuccessChime } from '../audio';
import { TRANSLATIONS } from '../translations';
import { SocialLink } from '../types';

interface FooterProps {
  onToggleAdmin: () => void;
  isAdminUnlocked?: boolean;
  lang?: 'en' | 'hi';
  pageViews?: number;
  socialLinks?: SocialLink[];
}

interface ClassroomBuddy {
  id: string;
  name: string;
  nameHi: string;
  avatar: string;
  role: string;
  roleHi: string;
  color: string;
  quoteIndex: number;
}

export const Footer: React.FC<FooterProps> = ({
  onToggleAdmin,
  isAdminUnlocked = false,
  lang = 'hi',
  pageViews = 1245,
  socialLinks = []
}) => {
  const t = TRANSLATIONS[lang];

  // Interactive Classroom buddies with adorable quotes
  const buddies: ClassroomBuddy[] = [
    { id: 'b-1', name: 'Chiku', nameHi: 'चीकू 🧑‍🦽', avatar: '🧑‍🦽', role: 'Artist child', roleHi: 'कला प्रेमी छात्र', color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800', quoteIndex: 0 },
    { id: 'b-2', name: 'Riya', nameHi: 'रिया 👧', avatar: '👧', role: 'Active star', roleHi: 'सक्रिय नन्ही सितारा', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300 text-pink-800', quoteIndex: 1 },
    { id: 'b-3', name: 'Kabir', nameHi: 'कबीर 👦', avatar: '👦', role: 'Block Builder', roleHi: 'प्रतिभाशाली विचारक', color: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800', quoteIndex: 2 },
    { id: 'b-4', name: 'Sarah', nameHi: 'सारा 👩‍🏫', avatar: '👩‍🏫', role: 'Speech therapist', roleHi: 'विशेष चिकित्सक', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-400 text-indigo-800', quoteIndex: 3 },
    { id: 'b-5', name: 'Gautam Sir', nameHi: 'गौतम सर 🧩', avatar: '👨‍🏫', role: 'Special Educator', roleHi: 'विशेष शिक्षक', color: 'bg-teal-100 hover:bg-teal-200 border-teal-400 text-teal-800', quoteIndex: 4 }
  ];

  const [activeBuddyId, setActiveBuddyId] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  const handleBuddyClick = (buddy: ClassroomBuddy) => {
    setActiveBuddyId(buddy.id);
    setActiveQuote(t.interactiveAvatarGreet[buddy.quoteIndex]);
    playBubbleSound();
  };

  return (
    <footer className="bg-slate-900 text-white mt-20 border-t border-slate-800 relative">
      
      {/* Decorative colored grid partition line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-pink-400 to-indigo-500" />

      {/* 5. INTERACTIVE LIVE PAGE VIEWS & AVATAR BLOCK (Super colorful and attractive) */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 border-b border-slate-800/80">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-[36px] border border-indigo-500/20 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
          
          {/* Neon lights */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 mb-6">
            <span className="px-3.5 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              ⚡ LIVE STATS & COMMUNITY
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight pt-1">
              {t.pageViewsTitle}
            </h3>
            <p className="text-slate-400 text-xs font-sans max-w-md mx-auto">
              {t.clickAvatar}
            </p>
          </div>

          {/* Interactive Avatars strip */}
          <div className="flex gap-4 items-center justify-center flex-wrap mb-6 max-w-xl">
            {buddies.map((buddy) => {
              const isSelected = buddy.id === activeBuddyId;
              return (
                <motion.div
                  key={buddy.id}
                  onClick={() => handleBuddyClick(buddy)}
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-2xl border cursor-pointer relative shadow-md transition-all ${buddy.color} ${
                    isSelected ? 'ring-2 ring-teal-400 scale-110' : ''
                  }`}
                  title={lang === 'hi' ? buddy.nameHi : buddy.name}
                >
                  <span>{buddy.avatar}</span>
                  <span className="absolute -bottom-6 text-[9px] font-bold text-slate-400 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {lang === 'hi' ? buddy.nameHi.split(' ')[0] : buddy.name}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Dialog Bubble Popup with transition */}
          <AnimatePresence mode="wait">
            {activeQuote && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 px-6 rounded-2xl text-xs md:text-sm text-teal-300 font-semibold mb-6 max-w-md relative shadow-lg"
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white/10" />
                <p className="italic font-sans">
                  "{activeQuote}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Page Views Numbers Ticker (NO PASSWORD LOCK) */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {t.liveViews}:
              </span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 4 }}
                className="px-5 py-1.5 bg-slate-950 border border-slate-800 text-teal-400 font-mono font-extrabold text-2xl rounded-xl tracking-widest shadow-inner inline-block min-w-[100px] text-center"
              >
                {pageViews.toLocaleString()}
              </motion.span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono italic mt-1 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              Online visitor stream live &bull; Securely counted
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Column A: Author Brand */}
          <div className="md:col-span-5 text-left space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧩</span>
              <span className="font-extrabold text-white text-md tracking-tight">
                {lang === 'en' ? 'Chandrashekhar Gautam' : 'चंद्रशेखर गौतम'}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {lang === 'en' 
                ? 'Dedicated Special Teacher compiling tailored exercises, physical stimulation guides, and creative sign language learning models for classrooms.'
                : 'विशेष आवश्यकता वाले बच्चों के शिक्षण, संवेदी शिक्षण सहायक सामग्री निर्माण और समावेशी समाज की स्थापना हेतु प्रतिबद्ध राजकीय विशेष शिक्षक।'
              }
            </p>
          </div>

          {/* Column B: Primary metadata text */}
          <div className="md:col-span-4 text-left md:text-center">
            <p className="text-slate-400 text-xs font-semibold">
              {lang === 'en' ? 'Developed by' : 'सृजक:'} <span className="text-teal-400 font-extrabold">{lang === 'en' ? 'Chandrashekhar Gautam' : 'चंद्रशेखर गौतम'}</span>,
            </p>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              {lang === 'en' ? 'Special Teacher with the help of AI & Antigravity' : 'राजकीय विशेष शिक्षक (एआई व एंटीग्रेविटी सपोर्ट के साथ)'}
            </p>
            <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase tracking-widest">
              &copy; 1998 - 2026 {lang === 'en' ? 'Inclusive Education Hub' : 'समावेशी शिक्षा प्रभाग'}.
            </p>
          </div>

          {/* Column C: Social channels & System Trigger */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end gap-1">
            
            {/* Social Icons Strip */}
            <div className="flex gap-2 mb-3">
              {socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playBubbleSound();
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 transition-all cursor-pointer hover:scale-110"
                  title={soc.name}
                >
                  <DynamicIcon name={(soc.iconName || 'Globe') as any} size={16} />
                </a>
              ))}
            </div>

            {/* Admin entry point - labelled properly */}
            <button
              onClick={() => {
                onToggleAdmin();
                playSuccessChime();
              }}
              className={`text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer active:scale-95 transition-all ${
                isAdminUnlocked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
            >
              <DynamicIcon name="Settings" size={11} />
              <span>{lang === 'en' ? 'Database Management Console' : 'डेटाबेस केंद्रीय नियंत्रण (Admin)'}</span>
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
};
