import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { playBubbleSound, playSuccessChime } from '../audio';
import { TRANSLATIONS } from '../translations';

// Accent theme colors for the dock's focus state
const THEME_ACCENTS = {
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600 font-bold',
    glow: 'shadow-indigo-500/30'
  },
  teal: {
    bg: 'bg-teal-600',
    text: 'text-teal-600 font-bold',
    glow: 'shadow-teal-500/30'
  },
  rose: {
    bg: 'bg-rose-600',
    text: 'text-rose-600 font-bold',
    glow: 'shadow-rose-500/30'
  },
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600 font-bold',
    glow: 'shadow-emerald-500/30'
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600 font-bold',
    glow: 'shadow-amber-500/30'
  },
  violet: {
    bg: 'bg-violet-600',
    text: 'text-violet-600 font-bold',
    glow: 'shadow-violet-500/30'
  }
};

interface DockMenuProps {
  activeTab: 'intro' | 'timeline' | 'publications' | 'news' | 'gallery' | 'achievements';
  setActiveTab: (tab: 'intro' | 'timeline' | 'publications' | 'news' | 'gallery' | 'achievements') => void;
  lang?: 'en' | 'hi';
  milestonesCount: number;
  publicationsCount: number;
  newsCount: number;
  galleryCount: number;
  achievementsCount: number;
  onAdminToggle: () => void;
  isAdminOpen: boolean;
  activeThemeColor?: 'indigo' | 'teal' | 'rose' | 'emerald' | 'amber' | 'violet';
}

export const DockMenu: React.FC<DockMenuProps> = ({
  activeTab,
  setActiveTab,
  lang = 'hi',
  milestonesCount,
  publicationsCount,
  newsCount,
  galleryCount,
  achievementsCount,
  onAdminToggle,
  isAdminOpen,
  activeThemeColor = 'indigo',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const t = TRANSLATIONS[lang];
  const accent = THEME_ACCENTS[activeThemeColor] || THEME_ACCENTS.indigo;

  // Custom tooltips/labels in Hindi and English
  const dockLabels: Record<string, { hi: string; en: string }> = {
    intro: { hi: 'मुख्य पेज', en: 'Home/Intro' },
    timeline: { hi: 'यात्रा मार्ग (समयरेखा)', en: 'Journey Path' },
    gallery: { hi: 'चित्र गैलरी', en: 'Photo Gallery' },
    publications: { hi: 'प्रकाशन (बुक्स)', en: 'Publications' },
    news: { hi: 'समाचार व मीडिया', en: 'News & Media' },
    achievements: { hi: 'उपलब्धियां', en: 'Achievements' },
    admin: { hi: 'एडमिन कंट्रोल', en: 'Admin Panel' }
  };

  const menuItems = [
    {
      id: 'intro' as const,
      iconName: 'Home' as const,
      badge: null,
      color: 'text-sky-600'
    },
    {
      id: 'timeline' as const,
      iconName: 'Compass' as const,
      badge: milestonesCount,
      color: 'text-teal-600'
    },
    {
      id: 'gallery' as const,
      iconName: 'Image' as const,
      badge: galleryCount,
      color: 'text-rose-600'
    },
    {
      id: 'publications' as const,
      iconName: 'BookOpen' as const,
      badge: publicationsCount,
      color: 'text-amber-600'
    },
    {
      id: 'news' as const,
      iconName: 'Newspaper' as const,
      badge: newsCount,
      color: 'text-indigo-600'
    },
    {
      id: 'achievements' as const,
      iconName: 'Award' as const,
      badge: achievementsCount,
      color: 'text-emerald-600'
    },
    {
      id: 'admin' as const,
      iconName: 'Settings2' as const,
      badge: null,
      color: 'text-slate-650',
      isSystemAction: true
    }
  ];

  return (
    <div id="dock-menu-wrapper" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max max-w-[95vw]">
      {/* Background container wrapper */}
      <div 
        className="pointer-events-auto relative px-5 py-3 rounded-[32px] bg-white/75 dark:bg-slate-900/75 border border-white/40 dark:border-slate-800/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-end gap-3 md:gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {menuItems.map((item, i) => {
          const isCurrentTab = item.id === activeTab || (item.id === 'admin' && isAdminOpen);
          
          // Magnification metrics based on distance
          let scale = 1;
          let y = 0;
          if (hoveredIdx !== null) {
            const dist = Math.abs(hoveredIdx - i);
            if (dist === 0) {
              scale = 1.35;
              y = -15;
            } else if (dist === 1) {
              scale = 1.15;
              y = -8;
            } else if (dist === 2) {
              scale = 1.05;
              y = -3;
            }
          }

          // Dynamically load safety icons
          const IconComponent = (Icons as any)[item.iconName] || Icons.HelpCircle;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center group/item"
              onMouseEnter={() => {
                setHoveredIdx(i);
                playBubbleSound();
              }}
            >
              {/* Tooltip Hover Overlay */}
              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute z-50 px-3.5 py-1.5 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl shadow-md border border-white/10 whitespace-nowrap pointer-events-none"
                  >
                    <span>{lang === 'hi' ? dockLabels[item.id].hi : dockLabels[item.id].en}</span>
                    {/* Tooltip tiny pointer arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon Circle */}
              <motion.button
                type="button"
                animate={{ scale, y }}
                transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                onClick={() => {
                  if (item.isSystemAction) {
                    onAdminToggle();
                  } else {
                    setActiveTab(item.id as any);
                  }
                  playSuccessChime();
                }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center relative cursor-pointer select-none transition-all duration-150 ${
                  isCurrentTab 
                    ? `bg-slate-100 border-2 border-slate-200 shadow-inner md:scale-[1.1]` 
                    : 'bg-white hover:bg-slate-50 border border-slate-100 shadow-sm'
                }`}
                style={{ contentVisibility: 'auto' }}
              >
                {/* Visual Icon */}
                <IconComponent 
                  size={24} 
                  className={`transition-colors duration-200 ${
                    isCurrentTab ? accent.text : 'text-slate-600 group-hover/item:text-slate-900'
                  }`} 
                />

                {/* Badge Indicator Meter */}
                {item.badge !== null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white pointer-events-none animate-bounce shadow-xs">
                    {item.badge}
                  </span>
                )}
              </motion.button>

              {/* Active Dot under active keys */}
              {isCurrentTab && (
                <div className="absolute top-[105%] left-1/2 -translate-x-1/2">
                  <span className={`block w-1.5 h-1.5 rounded-full ${accent.bg} ${accent.glow} animate-ping`} />
                  <span className={`block w-1.5 h-1.5 rounded-full ${accent.bg} ${accent.glow} absolute top-0`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
