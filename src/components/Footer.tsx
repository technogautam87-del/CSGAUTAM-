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

  const handleQuickNav = (tab: 'intro' | 'timeline' | 'publications' | 'news' | 'achievements' | 'gallery') => {
    if (onSelectTab) {
      onSelectTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSuccessChime();
    }
  };

  return (
    <footer id="portfolio-footer-section" className="bg-slate-50 border-t border-slate-200/80 text-slate-600 mt-12 py-7 relative transition-all">
      
      {/* Sleek top active separator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 absolute top-0 left-0" />



      <div className="max-w-7xl mx-auto px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs pt-4 border-t border-slate-200">
        
        {/* Left Segment: Branding and Nano Copyright text */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-xl">🎓</span>
          <div>
            <p className="font-extrabold text-slate-800 text-xs tracking-tight">
              {lang === 'en' ? 'Chandrashekhar Gautam' : 'चंद्रशेखर गौतम'}
              <span className="ml-2 font-black text-emerald-700 font-mono text-[9px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {lang === 'en' ? 'Special Teacher & ISL Interpreter' : 'विशेष शिक्षक और ISL दुभाषिया'}
              </span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              &copy; 1998 - 2026. Inclusive Education Hub.
            </p>
          </div>
        </div>

        {/* Center Segment: Live Views and Admin Panel Trigger */}
        <div className="flex items-center gap-4">
          {/* Page views counter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">{t.liveViews}</span>
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-teal-700 font-extrabold text-xs rounded">
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
                ? 'bg-emerald-550/10 border-emerald-550/40 text-emerald-700'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
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
                className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-teal-600 flex items-center justify-center transition-all cursor-pointer"
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
