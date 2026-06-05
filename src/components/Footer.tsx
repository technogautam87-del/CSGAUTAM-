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
  onSelectTab?: (tab: 'intro' | 'timeline' | 'publications' | 'news' | 'achievements' | 'gallery') => void;
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
  socialLinks = [],
  onSelectTab
}) => {
  const t = TRANSLATIONS[lang];

  // Interactive Classroom buddies with adorable quotes
  const buddies: ClassroomBuddy[] = [
    { id: 'b-1', name: 'Chiku', nameHi: 'चीकू 🧑‍🦽', avatar: '🧑‍🦽', role: 'Artist child', roleHi: 'कला प्रेमी छात्र', color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300', quoteIndex: 0 },
    { id: 'b-2', name: 'Riya', nameHi: 'रिया 👧', avatar: '👧', role: 'Active star', roleHi: 'सक्रिय नन्ही सितारा', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300 text-pink-800 dark:bg-pink-950/40 dark:border-pink-800 dark:text-pink-300', quoteIndex: 1 },
    { id: 'b-3', name: 'Kabir', nameHi: 'कबीर 👦', avatar: '👦', role: 'Block Builder', roleHi: 'प्रतिभाशाली विचारक', color: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300', quoteIndex: 2 },
    { id: 'b-4', name: 'Sarah', nameHi: 'सारा 👩‍🏫', avatar: '👩‍🏫', role: 'Speech therapist', roleHi: 'विशेष चिकित्सक', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-400 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300', quoteIndex: 3 },
    { id: 'b-5', name: 'Gautam Sir', nameHi: 'गौतम सर 🧩', avatar: '👨‍🏫', role: 'Special Educator', roleHi: 'विशेष शिक्षक', color: 'bg-teal-100 hover:bg-teal-200 border-teal-400 text-teal-800 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300', quoteIndex: 4 }
  ];

  const [activeBuddyId, setActiveBuddyId] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  const handleBuddyClick = (buddy: ClassroomBuddy) => {
    setActiveBuddyId(buddy.id);
    setActiveQuote(t.interactiveAvatarGreet[buddy.quoteIndex]);
    playBubbleSound();
  };

  const handleQuickNav = (tab: 'intro' | 'timeline' | 'publications' | 'news' | 'achievements' | 'gallery') => {
    if (onSelectTab) {
      onSelectTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSuccessChime();
    }
  };

  return (
    <footer id="portfolio-footer-section" className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-12 py-7 relative transition-all">
      
      {/* Sleek top active separator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 absolute top-0 left-0" />

      {/* Elegant & Interactive Classroom Buddies (Student Companions) Ribbon */}
      <div className="max-w-7xl mx-auto px-5 md:px-6 mb-8 text-left">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/20 p-5 rounded-[28px] border border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-inner">
          
          <div className="text-center lg:text-left space-y-1">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-teal-400 text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{lang === 'hi' ? 'हमारे क्लासरूम मित्र (Classroom Buddies)' : 'Our Classroom Buddies'}</span>
            </div>
            <h3 className="text-xs font-bold text-slate-300">
              {lang === 'hi' ? 'किसी भी प्यारे छात्र पर क्लिक करके उनकी मीठी आवाज़ और संदेशों को सुनें!' : 'Tap on any companion to hear their cheerful, inspiring quotes!'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {buddies.map((buddy) => {
              const isSelected = buddy.id === activeBuddyId;
              return (
                <button
                  key={buddy.id}
                  onClick={() => handleBuddyClick(buddy)}
                  className={`px-3 py-2 rounded-2xl border flex items-center gap-2 text-xs font-black transition-all active:scale-95 duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-450 text-white border-transparent ring-4 ring-emerald-500/25 scale-105 shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
                      : buddy.color
                  }`}
                  title={lang === 'hi' ? buddy.roleHi : buddy.role}
                >
                  <span className="text-sm">{buddy.avatar}</span>
                  <span>{lang === 'hi' ? buddy.nameHi : buddy.name}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Dynamic active buddy speech bubble */}
        <AnimatePresence mode="wait">
          {activeQuote && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="mt-4 p-4 bg-white dark:bg-slate-800 border-2 border-slate-150 dark:border-slate-700/75 rounded-[22px] shadow-lg text-center max-w-xl mx-auto relative text-xs font-black text-slate-700 dark:text-slate-200 italic"
            >
              {/* Speech bubble pointer */}
              <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white dark:bg-slate-800 border-t-2 border-l-2 border-slate-150 dark:border-slate-700/75 rotate-45" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-left flex-1 tracking-wide">
                  💬 "{activeQuote}"
                </span>
                <button
                  onClick={() => {
                    setActiveQuote(null);
                    setActiveBuddyId(null);
                    playBubbleSound();
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  {lang === 'hi' ? 'बंद करें ✕' : 'Close ✕'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs pt-4 border-t border-slate-850">
        
        {/* Left Segment: Branding and Nano Copyright text */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-xl">🎓</span>
          <div>
            <p className="font-extrabold text-white text-xs tracking-tight">
              {lang === 'en' ? 'Chandrashekhar Gautam' : 'चंद्रशेखर गौतम'}
              <span className="ml-2 font-black text-emerald-450 font-mono text-[9px] uppercase tracking-wider bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900">
                {lang === 'en' ? 'Special Teacher & ISL Interpreter' : 'विशेष शिक्षक और ISL दुभाषिया'}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              &copy; 1998 - 2026. Inclusive Education Hub.
            </p>
          </div>
        </div>

        {/* Center Segment: Live Views and Admin Panel Trigger */}
        <div className="flex items-center gap-4">
          {/* Page views counter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{t.liveViews}</span>
            <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-teal-400 font-extrabold text-xs rounded">
              {pageViews.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              onToggleAdmin();
              playSuccessChime();
            }}
            className={`text-[9px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded border transition-all active:scale-95 cursor-pointer ${
              isAdminUnlocked
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950 hover:bg-slate-850 hover:text-white border-slate-800 text-slate-400'
            }`}
          >
            <DynamicIcon name="Settings" size={9} />
            <span>{lang === 'en' ? 'Admin' : 'एडमिन'}</span>
          </button>
        </div>

        {/* Right Segment: Sleek Social Widgets & Page up Link */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {socialLinks.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playBubbleSound()}
                className="w-6 h-6 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-450 hover:text-teal-400 flex items-center justify-center transition-all cursor-pointer"
                title={soc.name}
              >
                <DynamicIcon name={(soc.iconName || 'Globe') as any} size={11} />
              </a>
            ))}
          </div>

          {/* Quick Back to Top helper */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              playSuccessChime();
            }}
            className="text-[10px] font-black tracking-widest uppercase text-slate-500 hover:text-teal-400 flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>{t.backToTop || '↑ TOP'}</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
